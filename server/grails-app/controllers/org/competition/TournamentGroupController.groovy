package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentGroupController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService

    TournamentGroupController() {
        super(TournamentGroup)
    }

    def groups(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)
        List<TournamentGroup> groups = TournamentGroup.findAllByTournament(tournament)
        respond groups
    }

    @Transactional
    def generateGroups(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)

        render status: CREATED
    }

    @Transactional
    def generateDraw(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)

        render status: CREATED
    }
}
