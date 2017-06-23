package org.competition

class TournamentCategory {

    int bestOf = 3
    int groupsOf = 3
    boolean includeGroupPhase = true
    String draw
    String bracketInfo

    static belongsTo = [tournament:Tournament, category:Category]

    static hasMany = [drawMatches:Match, groups:Group]

    static constraints = {
        bestOf blank:false, nullable:false, inList: [3, 5, 7]
        groupsOf blank:false, nullable:false, inList: [3, 4, 5]
        includeGroupPhase blank:false, nullable:false
        draw blank:true, nullable:true
        bracketInfo blank:true, nullable:true
    }
}
