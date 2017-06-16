package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class CountryController extends RestfulController {
    static responseFormats = ['json', 'xml']

    CountryController() {
        super(Country)
    }
}
