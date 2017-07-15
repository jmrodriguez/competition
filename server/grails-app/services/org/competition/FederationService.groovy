package org.competition

import grails.transaction.Transactional

@Transactional
class FederationService {

    /**
     * Gets the federations
     * @return
     */
    Object[] listFederations(String textFilter, Map metaParams) {
        ArrayList federations
        Map parameters = [:]
        long federationsCount

        String selectQuery = "from Federation f"
        String countQuery = "select count(f) from Federation f"

        if (textFilter) {
            selectQuery = selectQuery + " where (f.name like :textFilter)"
            countQuery = countQuery + " where (f.name like :textFilter)"
            parameters = ["textFilter": "%${textFilter}%"]
        }
        if (metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            if (order == null) {
                order = "asc"
            }
            selectQuery = selectQuery + " order by f." + sort + " " + order
        }

        federations = Federation.executeQuery(selectQuery, parameters, metaParams)
        federationsCount = Federation.executeQuery(countQuery, parameters)[0].toString() as Long

        return [federations, federationsCount]
    }
}
