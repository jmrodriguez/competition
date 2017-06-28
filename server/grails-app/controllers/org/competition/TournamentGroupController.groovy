package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.CREATED
import static org.springframework.http.HttpStatus.UNAUTHORIZED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentGroupController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def tournamentGroupService

    TournamentGroupController() {
        super(TournamentGroup)
    }

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

        User currentUser = springSecurityService.currentUser
        if((SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN") && currentUser.federation.id == tournament.federation.id) ||
            SpringSecurityUtils.ifAnyGranted("ROLE_SUPER_ADMIN, ROLE_GENERAL_ADMIN")){
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

            Map result = new HashMap()
            result.put("list", groups)
            result.put("total", groups.size())

            respond result
        } else {
            render status: UNAUTHORIZED
        }
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

            tournament.save flush: true

            Object[] results = tournamentGroupService.generateGroups(tournament)

            List<TournamentGroup> groups = results[0]

            groups.each {
                tournament.addToGroups(it)
            }

            tournament.save flush:true

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
    def generateDraw(Integer tournamentId) {
        if (tournamentId == null) {
            notFound()
            return
        }

        Tournament tournament = Tournament.findById(tournamentId)

        render status: CREATED
    }
}
