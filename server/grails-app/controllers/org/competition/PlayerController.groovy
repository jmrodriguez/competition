package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_FEDERATION_ADMIN', 'ROLE_GENERAL_ADMIN'])
class PlayerController extends RestfulController {
    static responseFormats = ['json', 'xml']

    def springSecurityService

    PlayerController() {
        super(Player)
    }

    @Transactional
    def save(Player playerInstance) {
        if (playerInstance == null) {
            notFound()
            return
        }

        User currentUser = springSecurityService.currentUser
        playerInstance.federation = currentUser.federation

        playerInstance.clearErrors()
        playerInstance.validate()

        if (playerInstance.hasErrors()) {
            respond playerInstance.errors, view:'create', model:[]
            return
        }

        playerInstance.save flush:true

        respond playerInstance, [status: CREATED]
    }
}
