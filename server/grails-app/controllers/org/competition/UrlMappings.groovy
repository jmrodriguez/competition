package org.competition

class UrlMappings {

    static mappings = {

        "/api/federation"(resources:"federation")
        "/api/country"(resources:"country")
        "/api/tournament"(resources:"tournament")
        "/api/tournamentCategory/$tournamentId/$categoryId" (controller: "tournamentCategory", action: "show", method: "GET")
        "/api/tournament/signUp/$playerId" (controller: "tournament", action: "signUp", method: "POST")
        "/api/tournament/signOff/$playerId" (controller: "tournament", action: "signOff", method: "POST")
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
