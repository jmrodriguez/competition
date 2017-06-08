package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class TournamentController extends RestfulController {
    static responseFormats = ['json', 'xml']
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
        List<Tournament> list = Tournament.list(params)
        respond list, model: ["total": countResources()]
    }
}
