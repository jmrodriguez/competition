package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.UNAUTHORIZED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentCategoryController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService

    TournamentCategoryController() {
        super(TournamentCategory)
    }

    def show(Integer tournamentId, Integer categoryId) {
        if (tournamentId != null && categoryId != null) {
            Tournament tournament = Tournament.findById(tournamentId)
            Category category = Category.findById(categoryId)

            if (tournament != null && category != null) {
                User currentUser = springSecurityService.currentUser
                // allow only federation admins to view and work with tournaments that belong to their federation
                // or general admins or super admins
                if((SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN") && currentUser.federation.id == tournament.federation.id) ||
                        SpringSecurityUtils.ifAnyGranted("ROLE_SUPER_ADMIN, ROLE_GENERAL_ADMIN") ){
                    List<TournamentCategory> tournamentCategoryList = TournamentCategory.findAllByTournamentAndCategory(tournament, category)

                    if (tournamentCategoryList.size() > 0) {
                        respond tournamentCategoryList.first()
                    } else {
                        render status: NOT_FOUND
                    }
                } else {
                    render status: UNAUTHORIZED
                }
            }
        } else {
            render status: NOT_FOUND
        }
    }
}
