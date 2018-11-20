package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.gorm.transactions.Transactional

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.OK
import static org.springframework.http.HttpStatus.UNAUTHORIZED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentGroupController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def tournamentGroupService

    TournamentGroupController() {
        super(TournamentGroup)
    }

    @Secured(["permitAll"])
    def groups(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)
        if (tournament == null) {
            notFound()
            return
        }

        List<TournamentGroup> groups = TournamentGroup.findAllByTournament(tournament).sort{
            it.number
        }

        // for each group, sort players, based on the tournament settings
        groups.each {group ->
            group.players = group.players.sort {x,y->
                if(x.ranking == y.ranking) {
                    x.id <=> y.id
                } else {
                    x.ranking <=> y.ranking
                }
            }
        }

        // for each group, sort matches, by their number
        groups.each {group ->
            group.groupMatches = group.groupMatches.sort {x,y->
                if(x.matchNumber == y.matchNumber) {
                    x.id <=> y.id
                } else {
                    x.matchNumber <=> y.matchNumber
                }
            }
        }

        Map result = new HashMap()
        result.put("list", groups)
        result.put("total", groups.size())

        respond result
    }

    @Transactional
    def generateGroups(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)
        if (tournament == null) {
            notFound()
            return
        }

        User currentUser = springSecurityService.currentUser
        if((SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN") && currentUser.federation.id == tournament.federation.id) ||
                SpringSecurityUtils.ifAnyGranted("ROLE_SUPER_ADMIN, ROLE_GENERAL_ADMIN")){

            tournament.groups.clear()
            tournament.bracketMatches.clear()

            tournament.bracketInfo = null

            tournament.save flush: true

            Object[] results = tournamentGroupService.generateGroups(tournament)

            List<TournamentGroup> groups = results[0]

            groups.each { group ->
                tournament.addToGroups(group)
            }

            tournament.save flush: true

            //respond result
            Map result = new HashMap()
            result.put("list", groups)
            result.put("total", results[1])

            respond result
        } else {
            render status: UNAUTHORIZED
        }
    }

    @Transactional
    def save(TournamentGroup tournamentGroupInstance) {
        if (tournamentGroupInstance == null) {
            notFound()
            return
        }

        tournamentGroupInstance.clearErrors()
        tournamentGroupInstance.validate()

        if (tournamentGroupInstance.hasErrors()) {
            respond tournamentGroupInstance.errors, view:'create', model:[]
            return
        }

        tournamentGroupInstance.save flush:true

        respond tournamentGroupInstance, [status: CREATED]
    }

    @Transactional
    def update(TournamentGroup tournamentGroupInstance) {
        if (tournamentGroupInstance == null) {
            notFound()
            return
        }

        if (tournamentGroupInstance.hasErrors()) {
            respond tournamentGroupInstance.errors, view:'edit'
            return
        }

        tournamentGroupInstance.save flush:true

        respond tournamentGroupInstance, [status: OK]
    }
}
