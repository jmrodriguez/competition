package org.competition


import grails.rest.*

@Resource(readOnly = false, formats = ['json', 'xml'])
class Player {

    String firstName
    String lastName
    String dni
    int points
    int fixedPoints
    int ranking
    int pointsFed
    int fixedPointsFed
    int rankingFed
    int pointsLm
    int fixedPointsLm
    int rankingLm
    int pointsLmFed
    int fixedPointsLmFed
    int rankingLmFed
    int pointsFem
    int fixedPointsFem
    int rankingFem
    int pointsFemFed
    int fixedPointsFemFed
    int rankingFemFed
    Date birth
    String club
    String email
    String gender

    Federation federation

    static belongsTo = [Federation, Tournament]
    static hasMany = [tournaments:Tournament]

    static constraints = {
        firstName blank:false, nullable:false
        lastName blank:false, nullable:false
        email blank:false, nullable:false
        dni blank:true, nullable:true
        club blank:true, nullable:true
        birth blank:false, nullable:false
        points nullable:true, min:1000
        pointsFed nullable:true, min:1000
        ranking nullable:true, min:0
        rankingFed nullable:true, min:0
        pointsLm nullable:true, min:500
        pointsLmFed nullable:true, min:500
        rankingLm nullable:true, min:0
        rankingLmFed nullable:true, min:0
        pointsFem nullable:true, min:500
        pointsFemFed nullable:true, min:500
        rankingFem nullable:true, min:0
        rankingFemFed nullable:true, min:0
        gender nullable:false, blank: false, inList: ["M", "F"]

    }

}