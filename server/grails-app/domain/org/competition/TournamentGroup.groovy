package org.competition

class TournamentGroup {

    Player winner
    Player runnerup
    int number

    static belongsTo = [tournament:Tournament]

    static hasMany = [players:Player, groupMatches:TournamentMatch]

    static constraints = {
        winner blank:true, nullable:true
        runnerup blank:true, nullable:true
    }

    static mapping = {
        groupMatches cascade: "all-delete-orphan"
    }
}
