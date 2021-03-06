package org.competition

class Federation {
    String name
    String description

    static belongsTo = [country: Country]

    static hasOne = [logo:FederationLogo, federationSettings:FederationSettings]

    static hasMany = [players:Player, pointsRanges:PointsRange]

    static constraints = {
        name nullable: false
        logo nullable:true
        description nullable:true, blank:true
    }

    static mapping = {
        pointsRanges cascade: "all-delete-orphan"
    }

}