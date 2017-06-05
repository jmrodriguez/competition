package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class Tournament {
    String name
    Date date = new Date()
    Boolean genderRestricted = false
    String gender
    String draw

    static belongsTo = [federation:Federation]
    static hasMany = [players:Player, matches:Match]

    static constraints = {
        name nullable:false, blank: false
        date nullable:false, blank: false
        genderRestricted nullable:false, blank: false
        gender nullable:true, blank: true, inList: ["M", "F"]
    }

}