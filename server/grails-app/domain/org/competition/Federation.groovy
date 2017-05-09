package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class Federation {
    String name
    String description

    static belongsTo = [country: Country]

    static hasOne = [logo:FederationLogo]

    static constraints = {
        name nullable: false
        logo nullable:true
        description nullable:true, blank:true
    }

}