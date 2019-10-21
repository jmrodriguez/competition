package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(["permitAll"])
class FederationSettingsController extends RestfulController {
    static responseFormats = ['json', 'xml']

    FederationSettingsController() {
        super(FederationSettings)
    }


}
