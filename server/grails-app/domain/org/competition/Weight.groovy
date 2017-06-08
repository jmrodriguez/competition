package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
@Resource(readOnly = false, formats = ['json', 'xml'])
class Weight {
    String name
    double factor

    static constraints = {
        name nullable:false, blank: false
        factor nullable:false, blank: false
    }

}