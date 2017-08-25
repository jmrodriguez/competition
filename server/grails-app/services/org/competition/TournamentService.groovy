package org.competition

import grails.transaction.Transactional

@Transactional
class TournamentService {

    Map<Long, Player> updatedPlayers

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

    void processMatches(Tournament tournament) {
        Set<TournamentMatch> bracketMatches = tournament.bracketMatches

        Set<TournamentGroup> groups = tournament.groups

        this.updatedPlayers = new HashMap<Long, Player>()

        // iterate group matches and apply their results
        groups.each {group ->
            Set<TournamentMatch> groupMatches = group.groupMatches
            groupMatches.each { groupMatch ->
                this.processMatch(groupMatch, tournament)
            }
        }

        // iterate bracket matches and apply their results
        bracketMatches.each {bracketMatch ->
            this.processMatch(bracketMatch, tournament)
        }

        // flush updated players

        this.updatedPlayers.each {id, player ->
            player.save flush: true
        }
    }

    void processMatch(TournamentMatch tournamentMatch, Tournament tournament) {
        Player player1
        Player player2

        // see if the player is already in the memory map
        Player updatedPlayer1 = this.updatedPlayers.get(tournamentMatch.player1.id)
        Player updatedPlayer2 = this.updatedPlayers.get(tournamentMatch.player2.id)
        if (updatedPlayer1) {
            player1 = updatedPlayer1
        } else {
            player1 = tournamentMatch.player1
        }

        if (updatedPlayer2) {
            player2 = updatedPlayer2
        } else {
            player2 = tournamentMatch.player2
        }

        int p1Points
        int p2Points
        int[] results

        boolean expectedResult

        if (tournament.federation == null) {
            // general points
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    p1Points = player1.fixedPointsFem
                    p2Points = player2.fixedPointsFem

                    if (tournamentMatch.winner.id == player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.pointsFem += results[0]
                        player2.pointsFem += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.pointsFem += results[0]
                        player1.pointsFem += results[1]
                    }
                } else {
                    p1Points = player1.fixedPoints
                    p2Points = player2.fixedPoints

                    if (tournamentMatch.winner.id == player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.points += results[0]
                        player2.points += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.points += results[0]
                        player1.points += results[1]
                    }
                }
            } else {
                // this is a under-X tournament
                p1Points = player1.fixedPointsLm
                p2Points = player2.fixedPointsLm

                if (tournamentMatch.winner.id == player1.id) {
                    expectedResult = p1Points > p2Points
                    results = this.getMatchResults(p1Points, p2Points, expectedResult)
                    player1.pointsLm += results[0]
                    player2.pointsLm += results[1]
                } else {
                    expectedResult = p1Points < p2Points
                    results = this.getMatchResults(p1Points, p2Points, expectedResult)
                    player2.pointsLm += results[0]
                    player1.pointsLm += results[1]
                }
            }
        } else {
            // federation tournament
            if (tournament.category.name.toLowerCase().equals("open")) {
                // this is an open tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    p1Points = player1.fixedPointsFemFed
                    p2Points = player2.fixedPointsFemFed

                    if (tournamentMatch.winner.id == player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.pointsFemFed += results[0]
                        player2.pointsFemFed += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.pointsFemFed += results[0]
                        player1.pointsFemFed += results[1]
                    }
                } else {
                    p1Points = player1.fixedPointsFed
                    p2Points = player2.fixedPointsFed

                    if (tournamentMatch.winner.id == player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.pointsFed += results[0]
                        player2.pointsFed += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.pointsFed += results[0]
                        player1.pointsFed += results[1]
                    }
                }
            } else {
                // this is a under-X tournament
                if (tournament.genderRestricted && tournament.gender.equals("F")) {
                    // this is a ladies event
                    p1Points = player1.fixedPointsLmFemFed
                    p2Points = player2.fixedPointsLmFemFed

                    if (tournamentMatch.winner.id == tournamentMatch.player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.pointsLmFemFed += results[0]
                        player2.pointsLmFemFed += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.pointsLmFemFed += results[0]
                        player1.pointsLmFemFed += results[1]
                    }
                } else {
                    p1Points = player1.fixedPointsLmFed
                    p2Points = player2.fixedPointsLmFed

                    if (tournamentMatch.winner.id == player1.id) {
                        expectedResult = p1Points > p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player1.pointsLmFed += results[0]
                        player2.pointsLmFed += results[1]
                    } else {
                        expectedResult = p1Points < p2Points
                        results = this.getMatchResults(p1Points, p2Points, expectedResult)
                        player2.pointsLmFed += results[0]
                        player1.pointsLmFed += results[1]
                    }
                }
            }
        }

        this.updatedPlayers.put(player1.id, player1)
        this.updatedPlayers.put(player2.id, player2)
    }

    /**
     * Calculates how many points a match winner wins and loser loses
     * @param winnerPoints the winner points
     * @param loserPoints the loser points
     * @param expectedResults whether the match had an expected result or not
     */
    int[] getMatchResults(int winnerPoints, int loserPoints, boolean expectedResult) {

        int pointsDiff = Math.abs(winnerPoints - loserPoints)

        if (expectedResult) {
            if (pointsDiff >= 0 && pointsDiff <= 50) {
                winnerPoints = 8
                loserPoints = -5
            } else if (pointsDiff >= 51 && pointsDiff <= 100) {
                winnerPoints = 6
                loserPoints = -4
            } else if (pointsDiff >= 101 && pointsDiff <= 250) {
                winnerPoints = 4
                loserPoints = -3
            } else if (pointsDiff >= 251 && pointsDiff <= 500) {
                winnerPoints = 3
                loserPoints = -2
            } else if (pointsDiff >= 501 && pointsDiff <= 1000) {
                winnerPoints = 2
                loserPoints = -1
            }
        } else {
            if (pointsDiff >= 0 && pointsDiff <= 100) {
                winnerPoints = 10
                loserPoints = -5
            } else if (pointsDiff >= 101 && pointsDiff <= 250) {
                winnerPoints = 15
                loserPoints = -8
            } else if (pointsDiff >= 251 && pointsDiff <= 500) {
                winnerPoints = 20
                loserPoints = -10
            } else if (pointsDiff >= 501 && pointsDiff <= 1000) {
                winnerPoints = 25
                loserPoints = -15
            } else if (pointsDiff <= 1000) {
                winnerPoints = 30
                loserPoints = -20
            }
        }

        return [winnerPoints, loserPoints]
    }
}
