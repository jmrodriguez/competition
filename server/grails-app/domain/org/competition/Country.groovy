package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class Country {
    String name
    String isoCode

}