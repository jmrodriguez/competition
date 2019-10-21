package org.competition

class FederationSettings {

    int bye = 10
    int unsubscribedPenalty = 20
    int firstPlace = 40
    int secondPlace = 30
    int thirdPlace = 20
    int fifthPlace = 10

    Federation federation

    static belongsTo = [Federation]

    static constraints = {
        bye blank:false, nullable:false
        unsubscribedPenalty blank:false, nullable:false
        firstPlace blank:false, nullable:false
        secondPlace blank:false, nullable:false
        thirdPlace blank:false, nullable:false
        fifthPlace blank:false, nullable:false
    }
}
