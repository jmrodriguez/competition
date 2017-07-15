package org.competition

import grails.transaction.Transactional

@Transactional
class WeightService {

    /**
     * Gets the weights
     * @return
     */
    Object[] listWeights(String textFilter, Map metaParams) {
        ArrayList weights
        Map parameters = [:]
        long weightsCount

        String selectQuery = "from Weight w"
        String countQuery = "select count(w) from Weight w"

        if (textFilter) {
            selectQuery = selectQuery + " where (w.name like :textFilter)"
            countQuery = countQuery + " where (w.name like :textFilter)"
            parameters = ["textFilter": "%${textFilter}%"]
        }
        if (metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            if (order == null) {
                order = "asc"
            }
            selectQuery = selectQuery + " order by w." + sort + " " + order
        }

        weights = Weight.executeQuery(selectQuery, parameters, metaParams)
        weightsCount = Weight.executeQuery(countQuery, parameters)[0].toString() as Long

        return [weights, weightsCount]
    }
}
