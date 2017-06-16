package org.competition

import grails.plugin.springsecurity.SpringSecurityUtils
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.transaction.Transactional

import static org.springframework.http.HttpStatus.*

@Transactional(readOnly = true)
@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN','ROLE_FEDERATION_ADMIN'])
class UserController extends RestfulController {
    static responseFormats = ['json', 'xml']
    UserController() {
        super(User)
    }

    //def asynchronousMailService
    def springSecurityService
    def userService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max, Integer page) {
        params.max = Math.min(max ?: 5, 10)
        if (page == null) {
            page = 1
        }

        int offset = page == 1 ? 0 : (page.intValue() - 1) * max
        params.offset = offset
        Federation federation = null

        if(SpringSecurityUtils.ifAllGranted("ROLE_FEDERATION_ADMIN")){
            federation = springSecurityService.currentUser.federation
        }

        Object[] results = userService.listUsers(federation, params.textFilter, params)

        //respond result
        Map result = new HashMap()
        result.put("list", results[0])
        result.put("total", results[1])

        respond result
    }

    def current() {

        User user = springSecurityService.currentUser

        respond user
    }

    def show(User userInstance) {

        Set roles = UserRole.findAllByUser(userInstance).collect { userRole ->
            userRole.role
        }

        //userInstance.roles = roles
        //userInstance.federation = UserFederation.findByUser(userInstance)?.federation

        respond userInstance
    }

    @Transactional
    def save(User userInstance) {
        //def userInstance = SpringSecurityUtils.securityConfig.get()lookupUserClass().newInstance(params)
        if (userInstance == null) {
            notFound()
            return
        }

        userInstance.clearErrors()
        userInstance.validate()

        if (userInstance.hasErrors()) {
            respond userInstance.errors, view:'create', model:[]
            return
        }

        userInstance.save flush:true

        // Assign role
        Role roleInstance = Role.findByAuthority('ROLE_FEDERATION_ADMIN')
        UserRole.create(userInstance, roleInstance, true)

        // activation email
        /*RegistrationCode registrationCode = new RegistrationCode(username:userInstance?.email).save(flush:true)

        String url = generateLink('resetPassword', [t: registrationCode.token])

        def conf = SpringSecurityUtils.securityConfig

        asynchronousMailService.sendMail {
            multipart true
            to userInstance?.email
            from conf.ui.register.emailFrom
            subject message(code:'account.activate.mail.header', default:'Por favor active su cuenta en el sistema VAMOS.')
            html g.render(template: "/mail/accountCreatedWithoutPassword",
                    model:[nombreUsuario:userInstance?.name, nombreFederation:federationInstance?.nombre, url:url])
            delete true;				// Mark message for delete after sent
            immediate true;			// Send message immediately
            priority 10;					// If priority greater then message send faster
        }*/

        respond userInstance, [status: CREATED]
    }

    @Transactional
    def update(User userInstance, Long federationId) {
        if (userInstance == null) {
            notFound()
            return
        }

        if (userInstance.hasErrors()) {
            respond userInstance.errors, view:'edit'
            return
        }

        userInstance.save flush:true

        // Assign role
        UserRole.removeAll(userInstance, true)
        Role roleInstance = Role.findByAuthority('ROLE_FEDERATION_ADMIN')
        UserRole.create(userInstance, roleInstance, true)

        respond userInstance, [status: OK]
    }

    /**
     *
     * @param userInstance
     * @param bloquear
     * @return
     */

    @Transactional
    def changeBlockState(User userInstance, Boolean block){
        if (userInstance == null) {
            notFound()
            return
        }

        userInstance.accountLocked = block
        userInstance.save flush:true

        respond userInstance, [status: OK]
    }

    @Transactional
    def delete(User userInstance) {

        if (userInstance == null) {
            notFound()
            return
        }

        UserRole.removeAll(userInstance)

        userInstance.delete flush:true

        render status: NO_CONTENT
    }

    protected void notFound() {
        render status: NOT_FOUND
    }
}
