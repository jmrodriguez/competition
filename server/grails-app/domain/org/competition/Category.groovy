package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
@Resource(readOnly = false, formats = ['json', 'xml'])
class Category {
    String name
    Integer minAge = 0
    Integer maxAge = 200

    static constraints = {
        name nullable:false, blank: false
        minAge nullable:false, blank: false
        maxAge nullable:false, blank: false
    }

}