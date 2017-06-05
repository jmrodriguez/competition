package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class Match {

    Player player1
    Player player2
    String result
    String setResults
    int matchNumber

    static belongsTo = [tournament:Tournament]

}