package org.competition

import grails.rest.RestfulController

class FederationController extends RestfulController {
    static responseFormats = ['json', 'xml']
    FederationController() {
        super(Federation)
    }
}
