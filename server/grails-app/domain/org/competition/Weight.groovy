package org.competition

class Weight {
    String name
    double factor

    static constraints = {
        name nullable:false, blank: false
        factor nullable:false, blank: false
    }

}