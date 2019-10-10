package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.gorm.transactions.Transactional

import static org.springframework.http.HttpStatus.CREATED

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

        if(SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
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

        Tournament tournament = Tournament.lock(tournamentId)

        Player player = Player.findById(playerId)

        tournament.addToPlayers(player)

        tournament.save flush:true

        render status: CREATED
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
        List<TournamentMatch> tournamentMatches = TournamentMatch.findAllByTournament(tournament)

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

        //throw new Exception("exception")
        // apply penalties to players who didn't play the tournament (if applicable)
        // apply byes
        playerService.applyByes(tournament)
        // apply matches
        tournamentService.processMatches(tournament)
        // re-arrange positions
        playerService.updateRankings(tournament)

        tournament.finished = true
        tournament.save flush: true

        respond tournament, [status: CREATED]
    }
}
