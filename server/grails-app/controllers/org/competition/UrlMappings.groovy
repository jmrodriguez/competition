package org.competition

class UrlMappings {

    static mappings = {

        "/api/federationSettings"(resources:"federationSettings")
        "/api/federation"(resources:"federation")
        "/api/country"(resources:"country")
        "/api/tournament"(resources:"tournament")
        "/api/pointsRange"(resources:"pointsRange")
        "/api/tournament/groups" (controller: "tournamentGroup", action: "groups", method: "GET")
        "/api/tournament/generateGroups/$tournamentId" (controller: "tournamentGroup", action: "generateGroups", method: "GET")
        "/api/tournament/generateDraw/$tournamentId" (controller: "tournament", action: "generateDraw", method: "GET")
        "/api/tournament/signUp/$tournamentId/$playerId" (controller: "tournament", action: "signUp", method: "GET")
        "/api/tournament/signOff/$tournamentId/$playerId" (controller: "tournament", action: "signOff", method: "GET")
        "/api/tournament/bracketResults" (controller: "tournament", action: "saveBracketResults", method: "POST")
        "/api/tournament/finishTournament" (controller: "tournament", action: "finishTournament", method: "POST")
        "/api/tournament/bulkSignup" (controller: "tournament", action: "bulkSignup", method: "POST")
        "/api/tournamentGroup"(resources:"tournamentGroup")
        "/api/user"(resources:"user")
        "/api/user/current" (controller: "user", action: "current", method: "GET")
        "/api/weight"(resources:"weight")
        "/api/category"(resources:"category")
        "/api/player"(resources:"player")
        "/api/player/upload" (controller: "player", action: "loadPlayersFile", method: "POST")
        "/api/application"(controller: 'application', action:'index')

        delete "/$controller/$id(.$format)?"(action:"delete")
        get "/$controller(.$format)?"(action:"index")
        get "/$controller/$id(.$format)?"(action:"show")
        post "/$controller(.$format)?"(action:"save")
        put "/$controller/$id(.$format)?"(action:"update")
        patch "/$controller/$id(.$format)?"(action:"patch")

        "/"(controller: 'application', action:'index')

        "500"(view: '/error')
        "404"(view: '/notFound')
        //"401"(view: '/unauthorized')
    }
}
