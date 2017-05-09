package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class FederationLogo {

    byte[] image

    static belongsTo = [federation:Federation]

    static constraints = {
        image nullable:false, size: 0..10000000
    }

    static mapping = {
        image sqlType:'MEDIUMBLOB'
    }

}