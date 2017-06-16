package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class WeightController extends RestfulController {
    static responseFormats = ['json', 'xml']

    WeightController() {
        super(Weight)
    }

    @Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN','ROLE_FEDERATION_ADMIN'])
    def index(Integer max) {
        super.index(max)
    }
}
