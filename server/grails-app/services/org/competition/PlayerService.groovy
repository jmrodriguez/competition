package org.competition

import grails.transaction.Transactional

@Transactional
class PlayerService {

    int BYE = 10

    /**
     * Gets the players related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listPlayers(Federation federation, Tournament tournament, Category category, String textFilter, Integer playerType, Map metaParams) {

        PointsRange pointsRange = tournament.getPointsRange()

        def currentYear = Calendar.instance.get(Calendar.YEAR)
        Integer lowerLimit
        Integer upperLimit
        if (category) {
            lowerLimit = currentYear - category.maxAge
            upperLimit = currentYear - category.minAge
        }

        ArrayList<Player> players
        boolean orderUsingSeedOrder = false
        if (tournament != null) {
            players = tournament.players
            if (!tournament.includeGroupPhase && tournament.seedOrder != null && metaParams.preventPagination) {
                orderUsingSeedOrder = true
            }
        } else if (federation != null){
            players = federation.players
        } else {
            players = Player.findAll()
        }

        // retrieve unsigned players
        if (playerType != null && playerType.intValue() == 1) {

            Set<Player> unsignedPlayers = federation.players.findAll {

                Calendar playerBirth = Calendar.getInstance()
                playerBirth.setTime(it.birth)
                int playerBirthYear = playerBirth.get(Calendar.YEAR)

                if (tournament.genderRestricted) {
                    if (lowerLimit && upperLimit) {
                        if (pointsRange) {
                            if (tournament.federation) {
                                it.pointsFed >= pointsRange.min && it.pointsFed <= pointsRange.max &&
                                        playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                        it.gender == tournament.gender && !(it in players)
                            } else {
                                it.points >= pointsRange.min && it.points <= pointsRange.max &&
                                        playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                        it.gender == tournament.gender && !(it in players)
                            }
                        } else {
                            playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                    it.gender == tournament.gender && !(it in players)
                        }
                    } else {
                        if (pointsRange) {
                            if (tournament.federation) {
                                it.pointsFed >= pointsRange.min && it.pointsFed <= pointsRange.max &&
                                        it.gender == tournament.gender && !(it in players)
                            } else {
                                it.points >= pointsRange.min && it.points <= pointsRange.max &&
                                        it.gender == tournament.gender && !(it in players)
                            }
                        } else {
                            it.gender == tournament.gender && !(it in players)
                        }
                    }
                } else {
                    if (lowerLimit && upperLimit) {
                        if (pointsRange) {
                            if (tournament.federation) {
                                it.pointsFed >= pointsRange.min && it.pointsFed <= pointsRange.max &&
                                        playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                        !(it in players)
                            } else {
                                it.points >= pointsRange.min && it.points <= pointsRange.max &&
                                        playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                        !(it in players)
                            }
                        } else {
                            playerBirthYear >= lowerLimit && playerBirthYear <= upperLimit &&
                                    !(it in players)
                        }
                    } else {
                        if (pointsRange) {
                            if (tournament.federation) {
                                it.pointsFed >= pointsRange.min && it.pointsFed <= pointsRange.max &&
                                        !(it in players)
                            } else {
                                it.points >= pointsRange.min && it.points <= pointsRange.max &&
                                        !(it in players)
                            }
                        } else {
                            !(it in players)
                        }
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
        } else {
            Set<Player> tempPlayers = players.findAll {

                Calendar cal = Calendar.getInstance()
                cal.setTime(it.birth)
                int year = cal.get(Calendar.YEAR)

                if (tournament != null && tournament.genderRestricted) {
                    if (lowerLimit && upperLimit) {
                        year >= lowerLimit && year <= upperLimit && it.gender == tournament.gender
                    } else {
                        it.gender == tournament.gender
                    }
                } else {
                    if (lowerLimit && upperLimit) {
                        year >= lowerLimit && year <= upperLimit
                    } else {
                        !(it in players)
                    }
                }
            }

            if (textFilter != null && !textFilter.isEmpty()) {
                tempPlayers = tempPlayers.findAll {
                    it.firstName.toLowerCase().contains(textFilter) ||
                            it.lastName.toLowerCase().contains(textFilter) ||
                            it.email.toLowerCase().contains(textFilter) ||
                            it.club.toLowerCase().contains(textFilter)
                }
            }
            players = tempPlayers.toList()
        }

        int total = players.size()

        if (metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            players.sort {
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

        if (orderUsingSeedOrder) {
            List<Player> orderedPlayers = new ArrayList<Player>()
            String[] playerIds = tournament.seedOrder.split(",")

            for (int i = 0; i < playerIds.length; i++) {
                long playerId = Long.parseLong(playerIds[i])

                for (int j = 0; j < players.size(); j++) {
                    Player player = players.get(j)
                    if (player.id == playerId) {
                        orderedPlayers.push(player)
                        break
                    }
                }
            }
            players = orderedPlayers
        }

        if (metaParams.max != null) {
            int to = metaParams.offset + metaParams.max
            to = to > total ? total : to
            players = players.subList(metaParams.offset, to)
        }

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

    /**
     * Sets the base points before applying results, based on the tournament passed as parameter
     * @param tournament the tournament to be used to know which base points to set
     */

    void setBasePoints(Tournament tournament) {

        Set<Player> players = this._getPlayers(tournament)

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    players.each { player ->
                        player.fixedPointsFem = player.pointsFem
                        player.save flush: true
                    }
                } else {
                    players.each { player ->
                        player.fixedPoints = player.points
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                players.each { player ->
                    player.fixedPointsLm = player.pointsLm
                    player.save flush: true
                }
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    players.each { player ->
                        player.fixedPointsFemFed = player.pointsFemFed
                        player.save flush: true
                    }
                } else {
                    players.each { player ->
                        player.fixedPointsFed = player.pointsFed
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    players.each { player ->
                        player.fixedPointsLmFemFed = player.pointsLmFemFed
                        player.save flush: true
                    }
                } else {
                    players.each { player ->
                        player.fixedPointsLmFed = player.pointsLmFed
                        player.save flush: true
                    }
                }
            }
        }
    }

    /**
     * Applies byes to the players in the given tournament
     * @param tournament the tournament to get byes to be applied
     */
    void applyByes(Tournament tournament) {

        Set<Player> playersWithBye = tournament.byes

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    playersWithBye.each { player ->
                        player.pointsFem += BYE
                        player.save flush: true
                    }
                } else {
                    playersWithBye.each { player ->
                        player.points += BYE
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                playersWithBye.each { player ->
                    player.pointsLm += BYE
                    player.save flush: true
                }
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    playersWithBye.each { player ->
                        player.pointsFemFed += BYE
                        player.save flush: true
                    }
                } else {
                    playersWithBye.each { player ->
                        player.pointsFed += BYE
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    playersWithBye.each { player ->
                        player.pointsLmFemFed += BYE
                        player.save flush: true
                    }
                } else {
                    playersWithBye.each { player ->
                        player.pointsLmFed += BYE
                        player.save flush: true
                    }
                }
            }
        }
    }

    /**
     * Updates the rankings for the players, based on the given tournament
     * @param tournament the tournament to know with rankings to be updated
     */
    void updateRankings(Tournament tournament) {

        // the list of players we need here is the one of the tournament's category
        List<Player> players = this._getPlayers(tournament).toList()

        // sort the players based on the tournament settings

        String sortColumn
        String rankingColumn

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    sortColumn = "pointsFem"
                    rankingColumn = "rankingFem"
                } else {
                    sortColumn = "points"
                    rankingColumn = "ranking"
                }
            } else {
                // this is a under-X tournament
                sortColumn = "pointsLm"
                rankingColumn = "rankingLm"
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    sortColumn = "pointsFemFed"
                    rankingColumn = "rankingFemFed"
                } else {
                    sortColumn = "pointsFed"
                    rankingColumn = "rankingFed"
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    sortColumn = "pointsLmFemFed"
                    rankingColumn = "rankingLmFemFed"
                } else {
                    sortColumn = "pointsLmFed"
                    rankingColumn = "rankingLmFed"
                }
            }
        }

        players.sort {
            it.getProperty(sortColumn)
        }
        // order points desc
        players.reverse(true)

        // now set the rankings accordingly
        int ranking  = 1

        players.each { player->
            player.setProperty(rankingColumn, ranking)
            player.save flush: true, failOnError: true
            ranking++
        }
    }


    /**
     * Returns all the players of a federation or all players, depending on the tournament passed as parameter
     * @param tournament the tournament to determine whether to return the tournament's federation players or all players
     * @return the set of players
     */
    private Set<Player> _getPlayers(Tournament tournament) {
        def currentYear = Calendar.instance.get(Calendar.YEAR)
        Integer lowerLimit
        Integer upperLimit
        if (tournament.category) {
            lowerLimit = currentYear - tournament.category.maxAge
            upperLimit = currentYear - tournament.category.minAge
        }

        ArrayList<Player> players
        if (tournament.federation != null){
            players = tournament.federation.players
        } else {
            players = Player.findAll()
        }

        Set<Player> tempPlayers = players.findAll {

            Calendar cal = Calendar.getInstance()
            cal.setTime(it.birth)
            int year = cal.get(Calendar.YEAR)

            if (tournament.genderRestricted) {
                if (lowerLimit && upperLimit) {
                    year >= lowerLimit && year <= upperLimit && it.gender == tournament.gender
                } else {
                    it.gender == tournament.gender
                }
            } else {
                if (lowerLimit && upperLimit) {
                    year >= lowerLimit && year <= upperLimit
                }
            }
        }

        return tempPlayers
    }
}
