package org.competition

import grails.gorm.transactions.Transactional

@Transactional
class PointsRangeService {

    /**
     * Gets the points ranges related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listPointsRanges(Federation federation, String textFilter, Map metaParams) {
        ArrayList pointsRanges
        Map parameters = [:]
        long pointsRangesCount
        String selectQuery
        String countQuery

        if (federation) {
            selectQuery = "select t from PointsRange t where t.federation = :federation"
            countQuery = "select count(t) from PointsRange t where t.federation = :federation"
            parameters = [federation: federation]

            if (textFilter) {
                selectQuery = selectQuery +
                        " and (" +
                        "t.name like :textFilter" +
                        ")"
                countQuery = countQuery +
                        " and (" +
                        "t.name like :textFilter" +
                        ")"
                parameters.put("textFilter", "%${textFilter}%")
            }

            if (metaParams.sort) {
                String sort = metaParams.sort
                String order = metaParams.order
                if (order == null) {
                    order = "asc"
                }
                selectQuery = selectQuery + " order by t." + sort + " " + order
            }
        } else {
            selectQuery = "from PointsRange t"
            countQuery = "select count(t) from PointsRange t"

            if (textFilter) {
                selectQuery = selectQuery +
                        " where (" +
                        "t.name like :textFilter" +
                        ")"
                countQuery = countQuery +
                        " where (" +
                        "t.name like :textFilter" +
                        ")"
                parameters = ["textFilter": "%${textFilter}%"]
            }
            if (metaParams.sort) {
                String sort = metaParams.sort
                String order = metaParams.order
                if (order == null) {
                    order = "asc"
                }
                selectQuery = selectQuery + " order by t." + sort + " " + order
            }
        }

        pointsRanges = Tournament.executeQuery(selectQuery, parameters, metaParams)
        pointsRangesCount = Tournament.executeQuery(countQuery, parameters)[0].toString() as Long

        return [pointsRanges, pointsRangesCount]
    }

    /**
     * Gets the default points ranges for new federations
     * @return
     */
    Object[] listDefaultPointsRanges(Map metaParams) {
        ArrayList pointsRanges
        Map parameters = [:]
        long pointsRangesCount
        String selectQuery
        String countQuery

        selectQuery = "from PointsRange t where t.federation is null"
        countQuery = "select count(t) from PointsRange t where t.federation is null"

        pointsRanges = Tournament.executeQuery(selectQuery, parameters, metaParams)
        pointsRangesCount = Tournament.executeQuery(countQuery, parameters)[0].toString() as Long

        return [pointsRanges, pointsRangesCount]
    }
}
