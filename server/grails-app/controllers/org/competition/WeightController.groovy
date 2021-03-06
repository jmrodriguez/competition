package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class WeightController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def weightService

    WeightController() {
        super(Weight)
    }

    @Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN','ROLE_FEDERATION_ADMIN'])
    def index(Integer max, Integer page, String sort, String order) {
        params.max = Math.min(max ?: 5, 100)
        if (page == null) {
            page = 1
        }

        int offset = page == 1 ? 0 : (page.intValue() - 1) * max
        params.offset = offset

        Object[] results = weightService.listWeights(params.textFilter, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }
}
