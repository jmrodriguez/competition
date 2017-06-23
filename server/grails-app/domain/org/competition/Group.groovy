package org.competition

class Group {

    Player first
    Player second

    static belongsTo = [tournamentCategory:TournamentCategory]

    static hasMany = [players:Player, matches:Match]

    static constraints = {
    }
}
