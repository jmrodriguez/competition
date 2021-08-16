package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.gorm.transactions.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class FederationController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def federationService
    def pointsRangeService

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

    @Transactional
    def save(Federation federationInstance) {
        if (federationInstance == null) {
            notFound()
            return
        }

        FederationSettings federationSettings = new FederationSettings()
        federationSettings.setFederation(federationInstance)
        federationInstance.setFederationSettings(federationSettings)

        federationInstance.clearErrors()
        federationInstance.validate()

        if (federationInstance.hasErrors()) {
            respond federationInstance.errors, view:'create', model:[]
            return
        }

        // create the default point ranges for the new federation

        Object[] defaultPointsRanges = pointsRangeService.listDefaultPointsRanges(params)

        defaultPointsRanges[0].each { pointsRange ->
            PointsRange newPointsRange = new PointsRange(pointsRange.properties)
            federationInstance.addToPointsRanges(newPointsRange)
        }

        federationInstance.save flush:true

        respond federationInstance, [status: CREATED]
    }

    def show(Federation federationInstance) {

        respond federationInstance
    }
}
