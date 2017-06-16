package org.competition

import grails.transaction.Transactional

@Transactional
class PlayerService {

    /**
     * Gets the users related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listPlayers(Federation federation, String textFilter, Map metaParams) {
        ArrayList players
        Map parameters = [:]
        long playersCount
        String selectQuery
        String countQuery

        if (federation) {
            selectQuery = "select p from Player p where p.federation = :federation"
            countQuery = "select count(p) from Player p where p.federation = :federation"
            parameters = [federation: federation]

            if (textFilter) {
                selectQuery = selectQuery + " and (p.firstName like :textFilter)"
                countQuery = countQuery + " and (p.firstName like :textFilter)"
                parameters.put("textFilter", "%${textFilter}%")
            }

        } else {
            selectQuery = "from Player p"
            countQuery = "select count(p) from Player p"

            if (textFilter) {
                selectQuery = selectQuery + " where (p.firstName like :textFilter)"
                countQuery = countQuery + " where (p.firstName like :textFilter)"
                parameters = ["textFilter": "%${textFilter}%"]
            }
        }

        players = User.executeQuery(selectQuery, parameters, metaParams)
        playersCount = User.executeQuery(countQuery, parameters)[0].toString() as Long

        return [players, playersCount]
    }
}
