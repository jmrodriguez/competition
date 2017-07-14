package org.competition

import grails.transaction.Transactional

@Transactional
class TournamentService {

    /**
     * Gets the tournaments related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listTournaments(Federation federation, String textFilter, Map metaParams) {
        ArrayList tournaments
        Map parameters = [:]
        long tournamentsCount
        String selectQuery
        String countQuery

        if (federation) {
            selectQuery = "select t from Tournament t where t.federation = :federation"
            countQuery = "select count(t) from Tournament t where t.federation = :federation"
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
            selectQuery = "from Tournament t"
            countQuery = "select count(t) from Tournament t"

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

        tournaments = Tournament.executeQuery(selectQuery, parameters, metaParams)
        tournamentsCount = Tournament.executeQuery(countQuery, parameters)[0].toString() as Long

        return [tournaments, tournamentsCount]
    }
}
