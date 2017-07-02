package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def tournamentService

    TournamentController() {
        super(Tournament)
    }

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
    def signUp(Tournament tournamentInstance, Integer playerId) {
        if (tournamentInstance == null || playerId == null) {
            notFound()
            return
        }

        Player player = Player.findById(playerId)

        tournamentInstance.addToPlayers(player)

        tournamentInstance.save flush:true

        render status: CREATED
    }

    @Transactional
    def signOff(Tournament tournamentInstance, Integer playerId) {
        if (tournamentInstance == null || playerId == null) {
            notFound()
            return
        }

        Player player = Player.findById(playerId)

        tournamentInstance.removeFromPlayers(player)

        tournamentInstance.save flush:true

        render status: CREATED
    }

    @Transactional
    def generateDraw(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)

        String finalDraw = String.join(",", RifaHelper.generarRifa(tournament.groups.size()))
        tournament.draw = finalDraw

        tournament.save flush:true

        respond tournament, [status: CREATED]
    }
}
