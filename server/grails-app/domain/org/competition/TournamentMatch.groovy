package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class TournamentMatch {

    Player player1
    Player player2
    String sets
    String points
    int matchNumber
    Player winner

    static belongsTo = [tournament:Tournament, tournamentGroup: TournamentGroup]

    static constraints = {
        player1 blank:false, nullable:false
        player2 blank:false, nullable:false
        winner blank:true, nullable:true
        sets blank:true, nullable:true
        points blank:true, nullable:true
        tournament blank:false, nullable:false
        tournamentGroup blank:true, nullable:true
    }
}