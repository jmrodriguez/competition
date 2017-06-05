package org.competition


import grails.rest.*
import grails.converters.*

class TournamentController extends RestfulController {
    static responseFormats = ['json', 'xml']
    TournamentController() {
        super(Tournament)
    }
}
