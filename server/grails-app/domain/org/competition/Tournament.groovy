package org.competition

class Tournament {
    String name
    Date date = new Date()
    Boolean genderRestricted = false
    String gender
    String draw
    Weight weight
    Federation federation

    static hasMany = [players:Player, matches:TournamentMatch]

    static constraints = {
        name nullable:false, blank: false
        date nullable:false, blank: false
        weight nullable:false, blank: false
        federation nullable:true, blank: true
        genderRestricted nullable:false, blank: false
        gender nullable:true, blank: true, inList: ["M", "F"]
        draw nullable:true, blank: true
    }

}