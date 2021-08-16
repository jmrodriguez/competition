package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.gorm.transactions.Transactional
import groovy.json.JsonBuilder
import org.apache.commons.lang.StringUtils
import org.apache.poi.ss.usermodel.DataFormatter
import org.apache.poi.ss.util.CellReference
import org.apache.poi.xssf.usermodel.XSSFRow
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook

import static org.springframework.http.HttpStatus.BAD_REQUEST
import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def tournamentService
    def playerService

    TournamentController() {
        super(Tournament)
    }

    @Secured(["permitAll"])
    def show(Tournament tournamentInstance) {
        respond tournamentInstance
    }

    @Secured(["permitAll"])
    def index(Integer max, Integer page) {
        params.max = Math.min(max ?: 5, 10)
        if (page == null) {
            page = 1
        }

        int offset = page == 1 ? 0 : (page.intValue() - 1) * max
        params.offset = offset
        Federation federation = null

        if(SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
            federation = springSecurityService.currentUser.federation
        }

        Object[] results = tournamentService.listTournaments(federation, params.textFilter, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }

    @Transactional
    def save(Tournament tournamentInstance) {
        if (tournamentInstance == null) {
            notFound()
            return
        }

        if (SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
            Federation federation = springSecurityService.currentUser.federation
            tournamentInstance.federation = federation
        }

        tournamentInstance.clearErrors()
        tournamentInstance.validate()

        if (tournamentInstance.hasErrors()) {
            respond tournamentInstance.errors, view:'create', model:[]
            return
        }

        tournamentInstance.save flush:true

        respond tournamentInstance, [status: CREATED]
    }

    @Transactional
    def signUp(Integer tournamentId, Integer playerId) {

        if (tournamentId == null || playerId == null) {
            notFound()
            return
        }

        boolean success = tournamentService.signUpPlayerToTournament(playerId, tournamentId)

        if (success) {
            render status: CREATED
        } else {
            render status: INTERNAL_SERVER_ERROR
        }
    }



    @Transactional
    def signOff(Integer tournamentId , Integer playerId) {
        if (tournamentId == null || playerId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.lock(tournamentId)

        Player player = Player.findById(playerId)

        tournament.removeFromPlayers(player)

        tournament.save flush:true

        render status: CREATED
    }

    @Transactional
    def generateDraw(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)

        String finalDraw
        if (tournament.includeGroupPhase) {
            finalDraw = String.join(",", RifaHelper.generarRifa(tournament.groups.size()))
        } else {
            int numGroups = Math.ceil(tournament.players.size() / 2)
            finalDraw = String.join(",", RifaHelper.generarRifa(numGroups))
        }

        tournament.draw = finalDraw

        tournament.bracketInfo = null

        tournament.save flush:true

        respond tournament, [status: CREATED]
    }

    @Transactional
    def saveBracketResults(Tournament tournament) {
        if (tournament == null) {
            notFound()
            return
        }

        // update the tournament matches list by getting the matches currently stored
        // and appending the ones from the bracket so they stored ones are not considered
        // orphans and deleted by the bracketMatches constraints
        List<TournamentMatch> tournamentMatches = TournamentMatch.findAllByTournament(tournament, [sort: "matchNumber", order: "desc"])

        int matchNumberBase = tournamentMatches != null && tournamentMatches.size() > 0 ? tournamentMatches.get(0).matchNumber : 0

        // add matchNumbers to the bracket matches
        tournament.bracketMatches.eachWithIndex { match, i ->
            match.setMatchNumber(matchNumberBase + match.getMatchNumber())
        }

        tournamentMatches.each { match ->
            tournament.addToBracketMatches(match)
        }

        tournament.save flush:true

        respond tournament, [status: CREATED]
    }

    @Transactional
    def finishTournament(Tournament tournament) {
        if (tournament == null) {
            notFound()
            return
        }

        // set base points
        playerService.setBasePoints(tournament)
        // apply penalties to players who didn't play the tournament (if applicable)
        playerService.applyPenalties(tournament)
        // apply byes
        playerService.applyByes(tournament)
        // apply matches
        tournamentService.processMatches(tournament)
        // apply bonuses to first 8 places in tournament
        playerService.applyBonuses(tournament)
        // re-arrange positions
        playerService.updateRankings(tournament)

        tournament.finished = true
        tournament.save flush: true

        respond tournament, [status: CREATED]
    }

    @Transactional
    def bulkSignup(){

        def playersFile = request.getFile('file')

        String tournamentIdString = request.getParameter('tournamentId')

        if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].contains(playersFile.getContentType()) && tournamentIdString != null) {

            Integer tournamentId = Integer.parseInt(tournamentIdString)

            DataFormatter dataFormatter = new DataFormatter()

            // process the uploaded file
            XSSFWorkbook book = new XSSFWorkbook(playersFile.inputStream)

            XSSFSheet sheet = book.getSheetAt(0)

            User currentUser = springSecurityService.currentUser

            Map bulkSignupResult = new HashMap()
            int signedUpPlayers = 0
            List<String> failedSignupIds = new ArrayList()
            List<String> errors = new ArrayList()

            // iterate through players
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++){
                XSSFRow row = sheet.getRow(i)

                String playerIdString = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("H") ))
                Integer playerId

                boolean skipSignUpForErrors = false

                if (StringUtils.isBlank(playerIdString)) {
                    // if player id is not present, that means we need to create the player first (new registration)
                    // then perform the signup
                    String firstName = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("A") ))
                    String lastName = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("B") ))
                    String email = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("C") ))
                    String dni = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("D") ))
                    String club = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("E") ))
                    Date birth = row.getCell(CellReference.convertColStringToIndex("F")).getDateCellValue()
                    String gender = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("G") ))

                    // check if the user already exists

                    Player player = Player.findByEmail(email)

                    if (player == null) {
                        player = new Player(
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                dni: dni,
                                club: club,
                                birth: birth,
                                gender: gender,
                                federation: currentUser.federation
                        )
                    }

                    player.clearErrors()
                    player.validate()

                    if (player.hasErrors()) {
                        // add to errors array
                        errors.add('Error creating player with data: ' + new JsonBuilder(player).toPrettyString())
                        skipSignUpForErrors = true
                    } else {
                        // create player
                        player.save flush:true
                        playerId = player.id
                    }
                } else {
                    playerId = Integer.parseInt(playerIdString)
                }

                if (!skipSignUpForErrors) {
                    boolean signupSuccess = tournamentService.signUpPlayerToTournament(playerId, tournamentId)

                    if (signupSuccess) {
                        signedUpPlayers++
                    } else {
                        failedSignupIds.add(playerId)
                    }
                }
            }

            bulkSignupResult.put('signedUpPlayers', signedUpPlayers)
            bulkSignupResult.put('failedSignupIds', failedSignupIds.join(','))
            bulkSignupResult.put('failedNewPlayerCreations', errors.join(','))

            respond(bulkSignupResult, status: CREATED)
        } else {
            render status: BAD_REQUEST
        }
    }
}
