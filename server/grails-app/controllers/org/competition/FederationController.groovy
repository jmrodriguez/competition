package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class FederationController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def federationService

    FederationController() {
        super(Federation)
    }

    @Secured(["permitAll"])
    def index(Integer max, Integer page, String sort, String order) {
        params.max = Math.min(max ?: 5, 100)
        if (page == null) {
            page = 1
        }

        int offset = page == 1 ? 0 : (page.intValue() - 1) * max
        params.offset = offset

        Object[] results = federationService.listFederations(params.textFilter, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }
}
