package org.competition

class  Tournament {
    String name
    Date date = new Date()
    Boolean genderRestricted = false
    String gender
    Weight weight
    Federation federation
    int bestOf = 3
    int groupsOf = 3
    boolean includeGroupPhase = true
    String draw
    String bracketInfo
    String seedOrder
    Category category
    PointsRange pointsRange
    Boolean finished = false

    static hasMany = [players:Player, byes:Player, bracketMatches:TournamentMatch, groups:TournamentGroup]

    static constraints = {
        name nullable:false, blank: false
        date nullable:false, blank: false
        weight nullable:false, blank: false
        federation nullable:true, blank: true
        genderRestricted nullable:false, blank: false
        gender nullable:true, blank: true, inList: ["M", "F"]
        bestOf blank:false, nullable:false, inList: [3, 5, 7]
        groupsOf blank:false, nullable:false, inList: [3, 4, 5]
        includeGroupPhase blank:false, nullable:false
        draw blank:true, nullable:true
        bracketInfo blank:true, nullable:true
        seedOrder blank:true, nullable:true
        pointsRange nullable: true, blank: true
        finished nullable:false, blank: false
    }

    static mapping = {
        players cascade: "save-update"
        groups cascade: "all-delete-orphan"
        bracketMatches cascade: "all-delete-orphan"
        bracketInfo sqlType:'LONGTEXT'
        seedOrder sqlType:'LONGTEXT'
    }

}