package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class TournamentMatch {

    Player player1
    Player player2
    String result
    String setResults
    int matchNumber

    static belongsTo = [tournament:Tournament]

    static constraints = {
        player1 blank:false, nullable:false
        player2 blank:false, nullable:false
        result blank:false, nullable:false
        setResults blank:true, nullable:true

    }
}