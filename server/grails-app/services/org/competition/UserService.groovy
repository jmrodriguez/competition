package org.competition

import grails.transaction.Transactional

@Transactional
class UserService {

    /**
     * Gets the users related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listUsers(Federation federation, String textFilter, Map metaParams) {
        ArrayList users
        Map parameters = [:]
        long usersCount
        String selectQuery
        String countQuery

        if (federation) {
            selectQuery = "select uf.user from UserFederation uf where uf.federation = :federation"
            countQuery = "select count(uf.user) from UserFederation uf where uf.federation = :federation"
            parameters = [federation: federation]

            if (textFilter) {
                selectQuery = selectQuery + " and (uf.user.name like :textFilter)"
                countQuery = countQuery + " and (uf.user.name like :textFilter)"
                parameters.put("textFilter", "%${textFilter}%")
            }


        } else {
            selectQuery = "from User u"
            countQuery = "select count(u) from User u"

            if (textFilter) {
                selectQuery = selectQuery + " where (u.name like :textFilter)"
                countQuery = countQuery + " where (u.name like :textFilter)"
                parameters = ["textFilter": "%${textFilter}%"]
            }
        }

        users = User.executeQuery(selectQuery, parameters, metaParams)
        usersCount = User.executeQuery(countQuery, parameters)[0].toString() as Long

        return [users, usersCount]
    }
}
