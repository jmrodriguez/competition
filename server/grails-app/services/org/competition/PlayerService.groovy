package org.competition

import grails.converters.JSON
import grails.gorm.transactions.Transactional
import org.grails.web.json.JSONObject
import org.grails.web.json.JSONArray

@Transactional
class PlayerService {

    int BYE = 10
    int UNSUBSCRIBED_PENALTY = 20
    int FIRST = 40
    int SECOND = 30
    int THIRD = 20
    int FIFTH = 10

    /**
     * Gets the players related to a given federation (if any)
     * @param federation
     * @return
     */
    Object[] listPlayers(Federation federation, Tournament tournament, Category category, String textFilter, Integer playerType, Map metaParams) {

        PointsRange pointsRange = tournament ? tournament.getPointsRange() : null

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

            // if this is a Lat event list, we use the entire list of users. Otherwise, we use the federation list
            Set<Player> baseList = federation == null ? Player.findAll() : federation.players

            Set<Player> unsignedPlayers = baseList.findAll {

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
                if (it.birth != null) {
                    cal.setTime(it.birth)
                } else {
                    cal.set(1900, 1, 1)
                }
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

        if (metaParams != null && metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            players.sort {x,y->
                if (x.getProperty(sort) == y.getProperty(sort)) {
                    x.id <=> y.id
                } else {
                    x.getProperty(sort) <=> y.getProperty(sort)
                }
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

        if (metaParams != null && metaParams.max != null) {
            int to = metaParams.offset + metaParams.max
            to = to > total ? total : to
            players = players.subList(metaParams.offset, to)
        }

        return [players, total]
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
     * Applies penalties to the players in the given tournament
     * @param tournament the tournament for penalties to be applied
     */
    void applyPenalties(Tournament tournament) {
        // a penalty for not playing the event
        List<Player> unsubscribedPlayers = listPlayers(tournament.federation, tournament, tournament.category, "", 1, null)[0];

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    unsubscribedPlayers.each { player ->
                        player.pointsFem -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                } else {
                    unsubscribedPlayers.each { player ->
                        player.points -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                unsubscribedPlayers.each { player ->
                    player.pointsLm -= UNSUBSCRIBED_PENALTY
                    player.save flush: true
                }
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    unsubscribedPlayers.each { player ->
                        player.pointsFemFed -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                } else {
                    unsubscribedPlayers.each { player ->
                        player.pointsFed -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    unsubscribedPlayers.each { player ->
                        player.pointsLmFemFed -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                } else {
                    unsubscribedPlayers.each { player ->
                        player.pointsLmFed -= UNSUBSCRIBED_PENALTY
                        player.save flush: true
                    }
                }
            }
        }
    }

    /**
     * Applies bonuses to the first 8 players in the given tournament
     * @param tournament the tournament for penalties to be applied
     */
    void applyBonuses(Tournament tournament) {
        JSONObject bracketInfoObj = JSON.parse(tournament.bracketInfo)

        List<List<TournamentMatch>> bracketMatchesList = new ArrayList();

        JSONArray teams = (JSONArray) bracketInfoObj.getJSONArray("teams")

        List<TournamentMatch> roundMatches = new ArrayList()
        for (int i = 0; i < teams.size(); i++) {
            JSONArray pair = teams.getJSONArray(i)
            Player p1 = null
            Player p2 = null

            JSONObject p1Obj = pair.optJSONObject(0)
            JSONObject p2Obj = pair.optJSONObject(1)

            if (p1Obj != null) {
                p1 = new Player()
                p1.setId(p1Obj.getLong("id"))
            }
            if (p2Obj != null) {
                p2 = new Player()
                p2.setId(p2Obj.getLong("id"))
            }

            TournamentMatch match = new TournamentMatch()

            match.setPlayer1(p1)
            match.setPlayer2(p2)
            roundMatches.add(match)
        }

        bracketMatchesList.add(roundMatches)

        JSONArray results = bracketInfoObj.getJSONArray("results")

        JSONArray round = results.getJSONArray(0)

        for (int i = 0; i < round.size(); i++) {
            roundMatches = bracketMatchesList.get(i)

            List<TournamentMatch> nextRoundMatches = new ArrayList()
            // set round matches winners
            JSONArray roundResults = round.getJSONArray(i)

            TournamentMatch nextRoundMatch = null
            for (int j = 0; j < roundResults.size(); j++) {
                TournamentMatch match = roundMatches.get(j)
                JSONArray resultArray = roundResults.getJSONArray(j)
                int p1Sets = resultArray.optInt(0, 0)
                int p2Sets = resultArray.optInt(1, 0)
                if (p1Sets == 0 && p2Sets == 0) {
                    // this is a bye, set as winner the player in the match (there must be one player and one null)
                    if (match.player1 != null) {
                        match.winner = match.player1
                    }
                    if (match.player2 != null) {
                        match.winner = match.player2
                    }
                } else {
                    if (p1Sets > p2Sets) {
                        match.winner = match.player1
                    } else {
                        match.winner = match.player2
                    }
                }

                if (roundResults.size() > 1) { // only if we are not in the final round
                    if (j % 2 == 0) { // even index we create next round match and set player1
                        nextRoundMatch = new TournamentMatch()
                        nextRoundMatch.setPlayer1(match.winner)
                    } else { // odd we set player2 and add the match to the next round list
                        nextRoundMatch.setPlayer2(match.winner)
                        nextRoundMatches.add(nextRoundMatch)
                    }
                }
            }
            if (!nextRoundMatches.isEmpty()) {
                bracketMatchesList.add(nextRoundMatches)
            }
        }

        List<Player> firstEight = new ArrayList()
        for (int i = bracketMatchesList.size() - 1; i >=0; i--) {
            if (firstEight.size() == 8) {
                break
            } else {
                roundMatches = bracketMatchesList.get(i)

                for (int j = 0; j < roundMatches.size(); j++) {
                    TournamentMatch match = roundMatches.get(j)
                    if (!firstEight.contains(match.winner)) {
                        firstEight.add(match.winner)
                    }

                    if (match.player1 != null && !firstEight.contains(match.player1)) {
                        firstEight.add(match.player1)
                    }

                    if (match.player2 != null && !firstEight.contains(match.player2)) {
                        firstEight.add(match.player2)
                    }
                }
            }
        }

        // load the players from the DB to attach them to the hibernate session so we can update and save them
        List<Player> dbPlayers = new ArrayList<>();
        for(int i = 0; i < firstEight.size(); i++) {
            Player player = firstEight.get(i)
            dbPlayers.add(Player.findById(player.id))
        }

        firstEight = dbPlayers

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.pointsFem += FIRST
                        } else if (i == 1) {
                            player.pointsFem += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.pointsFem += THIRD
                        } else {
                            player.pointsFem += FIFTH
                        }
                    }
                } else {
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.points += FIRST
                        } else if (i == 1) {
                            player.points += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.points += THIRD
                        } else {
                            player.points += FIFTH
                        }
                    }
                }
            } else {
                // this is a under-X tournament
                for(int i = 0; i < firstEight.size(); i++) {
                    Player player = firstEight.get(i)
                    if (i == 0) {
                        player.pointsLm += FIRST
                    } else if (i == 1) {
                        player.pointsLm += SECOND
                    } else if (i >= 2 && i < 4) {
                        player.pointsLm += THIRD
                    } else {
                        player.pointsLm += FIFTH
                    }
                }
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.pointsFemFed += FIRST
                        } else if (i == 1) {
                            player.pointsFemFed += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.pointsFemFed += THIRD
                        } else {
                            player.pointsFemFed += FIFTH
                        }
                    }
                } else {
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.pointsFed += FIRST
                        } else if (i == 1) {
                            player.pointsFed += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.pointsFed += THIRD
                        } else {
                            player.pointsFed += FIFTH
                        }
                    }
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.pointsLmFemFed += FIRST
                        } else if (i == 1) {
                            player.pointsLmFemFed += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.pointsLmFemFed += THIRD
                        } else {
                            player.pointsLmFemFed += FIFTH
                        }
                    }
                } else {
                    for(int i = 0; i < firstEight.size(); i++) {
                        Player player = firstEight.get(i)
                        if (i == 0) {
                            player.pointsLmFed += FIRST
                        } else if (i == 1) {
                            player.pointsLmFed += SECOND
                        } else if (i >= 2 && i < 4) {
                            player.pointsLmFed += THIRD
                        } else {
                            player.pointsLmFed += FIFTH
                        }
                    }
                }
            }
        }

        for(int i = 0; i < firstEight.size(); i++) {
            Player player = firstEight.get(i)
            player.save flush: true, failOnError:true
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
