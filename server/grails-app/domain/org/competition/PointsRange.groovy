package org.competition

class PointsRange {
    String name
    int min
    int max
    Federation federation

    static constraints = {
        name nullable:false, blank: false
        min nullable:false, blank: false
        max nullable:false, blank: false
        federation nullable:true, blank: true

    }

}