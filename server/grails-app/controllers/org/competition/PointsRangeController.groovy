package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class PointsRangeController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService
    def pointsRangeService

    PointsRangeController() {
        super(PointsRange)
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

        Object[] results = pointsRangeService.listPointsRanges(federation, params.textFilter, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }

    @Transactional
    def save(PointsRange pointsRangeInstance) {
        if (pointsRangeInstance == null) {
            notFound()
            return
        }

        if(SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
            Federation federation = springSecurityService.currentUser.federation
            pointsRangeInstance.federation = federation
        }

        pointsRangeInstance.clearErrors()
        pointsRangeInstance.validate()

        if (pointsRangeInstance.hasErrors()) {
            respond pointsRangeInstance.errors, view:'create', model:[]
            return
        }

        pointsRangeInstance.save flush:true

        respond pointsRangeInstance, [status: CREATED]
    }
}
