package org.competition

class Player {

    String firstName
    String lastName
    String dni
    int points = 1000
    int fixedPoints = 0
    int ranking = 0
    int pointsFed = 1000
    int fixedPointsFed = 0
    int rankingFed = 0
    int pointsLm = 500
    int fixedPointsLm = 0
    int rankingLm = 0
    int pointsLmFed = 500
    int fixedPointsLmFed = 0
    int rankingLmFed = 0
    int pointsFem = 500
    int fixedPointsFem = 0
    int rankingFem = 0
    int pointsFemFed = 500
    int fixedPointsFemFed = 0
    int rankingFemFed = 0
    int pointsLmFemFed = 500
    int fixedPointsLmFemFed = 0
    int rankingLmFemFed = 0
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
        email blank:false, nullable:false, unique: true
        dni blank:true, nullable:true
        club blank:false, nullable:false
        birth blank:false, nullable:false
        points blank:true, nullable:true
        pointsFed blank:true, nullable:true
        ranking blank:true, nullable:true
        rankingFed blank:true, nullable:true
        pointsLm blank:true, nullable:true
        pointsLmFed blank:true, nullable:true
        pointsFem blank:true, nullable:true
        pointsFemFed blank:true, nullable:true
        pointsLmFemFed blank:true, nullable:true
        rankingLm blank:true, nullable:true
        rankingLmFed blank:true, nullable:true
        rankingFem blank:true, nullable:true
        rankingFemFed blank:true, nullable:true
        rankingLmFemFed blank:true, nullable:true
        gender nullable:false, blank: false, inList: ["M", "F"]
        federation blank:false, nullable:false
    }

}