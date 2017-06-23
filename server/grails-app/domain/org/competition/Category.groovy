package org.competition

class Category {
    String name
    Integer minAge = 0
    Integer maxAge = 200
    boolean youthCategory = false

    static constraints = {
        name nullable:false, blank: false
        minAge nullable:false, blank: false
        maxAge nullable:false, blank: false
        youthCategory nullable:false, blank: false
    }

}