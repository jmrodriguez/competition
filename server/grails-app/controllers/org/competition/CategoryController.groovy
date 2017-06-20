package org.competition

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN'])
class CategoryController extends RestfulController {
	static responseFormats = ['json', 'xml']

    CategoryController() {
        super(Category)
    }

    @Secured(['ROLE_SUPER_ADMIN', 'ROLE_GENERAL_ADMIN','ROLE_FEDERATION_ADMIN'])
    def index(Integer max) {
        super.index(max)
    }
}
