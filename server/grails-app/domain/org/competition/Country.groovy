package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
@Secured(['IS_AUTHENTICATED_ANONYMOUSLY'])
class Country {
    String name
    String isoCode

}