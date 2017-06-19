package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional
import org.apache.poi.ss.usermodel.DataFormatter
import org.apache.poi.ss.util.CellReference
import org.apache.poi.xssf.usermodel.XSSFRow
import org.apache.poi.xssf.usermodel.XSSFSheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.BAD_REQUEST

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class PlayerController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def playerService

    PlayerController() {
        super(Player)
    }

    def index(Integer tournamentId, Integer categoryId, String textFilter, Integer page, Integer playerType, Integer max) {

        Tournament tournament = null
        if (tournamentId != null) {
            tournament = Tournament.findById(tournamentId)
        }

        Category category = null
        if (categoryId != null) {
            category = Category.findById(categoryId)
        } else {
            // get the default category
            category = Category.findById(1)
        }

        params.max = Math.min(max ?: 5, 10)
        if (page == null) {
            page = 1
        }

        int offset = page == 1 ? 0 : (page.intValue() - 1) * max
        params.offset = offset
        Federation federation = null

        if(SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
            federation = springSecurityService.currentUser.federation
            if (tournament != null && tournament.federation.id != federation.id) {
                render status: BAD_REQUEST
                // allow admins to see the list of players only for tournaments of their own federation
                return
            }
        }

        Object[] results = playerService.listPlayers(federation, tournament, category, textFilter, playerType, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }

    @Transactional
    def save(Player playerInstance) {
        if (playerInstance == null) {
            notFound()
            return
        }

        User currentUser = springSecurityService.currentUser
        playerInstance.federation = currentUser.federation

        playerInstance.clearErrors()
        playerInstance.validate()

        if (playerInstance.hasErrors()) {
            respond playerInstance.errors, view:'create', model:[]
            return
        }

        playerInstance.save flush:true

        respond playerInstance, [status: CREATED]
    }

    @Transactional
    def loadPlayersFile(){

        def playersFile = request.getFile('file')

        if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].contains(playersFile.getContentType())) {

            DataFormatter dataFormatter = new DataFormatter()

            // process the uploaded file
            XSSFWorkbook book = new XSSFWorkbook(playersFile.inputStream)

            XSSFSheet sheet = book.getSheetAt(0)

            User currentUser = springSecurityService.currentUser

            List<Player> players = new ArrayList<>()
            
            // iterate through players, validating their info before saving them to DB
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++){
                XSSFRow row = sheet.getRow(i)

                // Informacion del estudiante
                String firstName = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("A") ))
                String lastName = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("B") ))
                String email = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("C") ))
                String dni = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("D") ))
                String club = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("E") ))
                Date birth = row.getCell(CellReference.convertColStringToIndex("F")).getDateCellValue()
                String gender = dataFormatter.formatCellValue(row.getCell( CellReference.convertColStringToIndex("G") ))

                if (firstName && lastName && email && dni && club && birth && gender ) {

                    // check if the user already exists

                    Player player = Player.findByEmail(email)

                    if (player != null) {
                        // update current info
                        player.firstName = firstName
                        player.lastName = lastName
                        player.dni = dni
                        player.club = club
                        player.birth = birth
                        player.gender = gender
                    } else {
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
                        respond player.errors, view:'create', model:[]
                        return
                    }

                    players.add(player)
                }
            }

            int count = 0
            // ok now flush them
            for (Player player in players) {
                player.save flush:true
                count++
            }
            respond([totalCreated: count], status: CREATED)
            //render status: CREATED, model: [totalCreated: count]
        } else {
            render status: BAD_REQUEST
        }

    }
}
