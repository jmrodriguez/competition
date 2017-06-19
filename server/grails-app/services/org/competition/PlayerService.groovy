package org.competition

import grails.transaction.Transactional

@Transactional
class PlayerService {

    /**
     * Gets the players related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listPlayers(Federation federation, Tournament tournament, Category category, String textFilter, Integer playerType, Map metaParams) {

        def currentYear = Calendar.instance.get(Calendar.YEAR)
        Integer lowerLimit
        Integer upperLimit
        if (category) {
            lowerLimit = currentYear - category.maxAge
            upperLimit = currentYear - category.minAge
        }

        ArrayList<Player> players
        if (tournament != null) {
            players = tournament.players
        } else {
            players = federation.players
        }

        // retrieve unsigned players
        if (playerType != null && playerType.intValue() == 1) {

            Set<Player> unsignedPlayers = federation.players.findAll {

                Calendar cal = Calendar.getInstance()
                cal.setTime(it.birth)
                int year = cal.get(Calendar.YEAR)

                if (tournament.genderRestricted) {
                    if (lowerLimit && upperLimit) {
                        year >= lowerLimit && year <= upperLimit && it.gender == tournament.gender && !(it in players)
                    } else {
                        it.gender == tournament.gender && !(it in players)
                    }
                } else {
                    if (lowerLimit && upperLimit) {
                        year >= lowerLimit && year <= upperLimit && !(it in players)
                    } else {
                        !(it in players)
                    }
                }
            }

            if (textFilter != null && !textFilter.isEmpty()) {
                unsignedPlayers = unsignedPlayers.findAll {
                    it.firstName.toLowerCase().contains(textFilter) ||
                            it.lastName.toLowerCase().contains(textFilter) ||
                            it.email.toLowerCase().contains(textFilter) ||
                            it.club.toLowerCase().contains(textFilter)
                }
            }
            players = unsignedPlayers.toList()
        }

        int total = players.size()

        if (metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            players.sort{
                it.getProperty(sort)
            }
            if (order != null && order == "desc") {
                players.reverse(true)
            }
        } else {
            players.sort{
                it.id
            }
        }

        int to = metaParams.offset + metaParams.max
        to = to > total ? total : to
        players = players.subList(metaParams.offset, to)

        return [players, total]

        /*ArrayList players
        Map parameters = [:]
        long playersCount
        String selectQuery
        String countQuery

        if (federation) {
            selectQuery = "select p from Player p where p.federation = :federation"
            countQuery = "select count(p) from Player p where p.federation = :federation"
            parameters = [federation: federation]

            if (textFilter) {
                selectQuery = selectQuery +
                        " and (" +
                        "p.firstName like :textFilter or " +
                        "p.lastName like :textFilter or " +
                        "p.email like :textFilter or " +
                        "p.club like :textFilter" +
                        ")"
                countQuery = countQuery +
                        " and (" +
                        "p.firstName like :textFilter or " +
                        "p.lastName like :textFilter or " +
                        "p.email like :textFilter or " +
                        "p.club like :textFilter" +
                        ")"
                parameters.put("textFilter", "%${textFilter}%")
            }

        } else {
            selectQuery = "from Player p"
            countQuery = "select count(p) from Player p"

            if (textFilter) {
                selectQuery = selectQuery +
                        " where (" +
                        "p.firstName like :textFilter or " +
                        "p.lastName like :textFilter or " +
                        "p.email like :textFilter or " +
                        "p.club like :textFilter" +
                        ")"
                countQuery = countQuery +
                        " where (" +
                        "p.firstName like :textFilter or " +
                        "p.lastName like :textFilter or " +
                        "p.email like :textFilter or " +
                        "p.club like :textFilter" +
                        ")"
                parameters = ["textFilter": "%${textFilter}%"]
            }
        }

        players = Player.executeQuery(selectQuery, parameters, metaParams)
        playersCount = Player.executeQuery(countQuery, parameters)[0].toString() as Long

        return [players, playersCount]*/
    }
}
