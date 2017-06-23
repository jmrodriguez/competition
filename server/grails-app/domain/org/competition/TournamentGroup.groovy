package org.competition

class TournamentGroup {

    Player first
    Player second
    int number

    static belongsTo = [tournament:Tournament]

    static hasMany = [players:Player, matches:Match]

    static constraints = {
    }
}
