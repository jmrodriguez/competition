package org.competition

/**
 * @author Juan Manuel Rodriguez
 * juan.manuel.rodriguez@gmail.com
 * @version 1.0
 * @since 1.0
 */
class TournamentGroupService {

	/**
	 * Generate the tournament groups
	 * @param jugadores la lista de jugadores del torneo
	 * @param gruposDe4 si se prefieren grupos de 4 o
	 * @return lista de grupos del torneo
	 */
	List generateGroups(Tournament tournament) {

		List<Player> players = tournament.players.asList()

		// sort players by their ranking depending on the type of tournament
		if (tournament.federation == null) {
			if (tournament.genderRestricted && tournament.gender.equals("F")) {
				players = players.sort {
					it.rankingFem
				}
			} else {
				if (tournament.category.youthCategory) {
					players = players.sort {
						it.rankingLm
					}
				} else {
					players = players.sort {
						it.ranking
					}
				}

			}
		} else {
			if (tournament.genderRestricted && tournament.gender.equals("F")) {
				players = players.sort {
					it.rankingFemFed
				}
			} else {
				if (tournament.category.youthCategory) {
					players = players.sort {
						it.rankingLmFed
					}
				} else {
					players = players.sort {
						it.rankingFed
					}
				}
			}
		}

		int groupCount = getGroupCount(players.size(), tournament.groupsOf)

		List<TournamentGroupService> groups = applySnake(tournament, groupCount, players)
		return [groups, groups.size()]
	}

	/**
	 * Creates the tournament groups, applying the snake algorithm
	 * @param tournament the tournament
	 * @param groupCount the number of groups
	 * @param players the tournament players
	 * @return the list of tournament groups
	 */
	private List applySnake(Tournament tournament, int groupCount, List players) {
		List<TournamentGroup> groups = new ArrayList()
		for (int i = 0; i < groupCount; i++) {
			TournamentGroup group = new TournamentGroup(number: i + 1, tournament: tournament)
			groups.add(group)
		}

		boolean reverse = false
		int i = 0

		players.each {
			groups.get(i).addToPlayers(it)
			if (!reverse) {
				i++
				if (i == groupCount) {
					reverse = true
					i--
				}
			} else {
				i--
				if (i == -1) {
					reverse = false
					i++
				}
			}
		}

		return groups
	}

	/**
	 * Calculates the number of groups based on the signed up players count
	 * @param playersCount number of players
	 * @param groupsOf how many players per grup
	 * @return the number of groups
	 */
	private int getGroupCount(int playersCount, int groupsOf) {
		int groupsOf3
		int groupsOf4

		switch(groupsOf) {
			case 3:
				// calculate to build groups of 3 players
				// el modulo de la division del numero de jugadores entre 3 es el
				// numero de grupos de 4
				groupsOf4 = playersCount % 3
				// la resta del entero resultado de la division del numero de
				// jugadores entre 3 y el modulo la misma division (o el numero
				// de grupos de 4) es el numero de grupos de 3
				groupsOf3 = (playersCount / 3) - groupsOf4
				break
			case 4:
				// calculate to build groups of 4 players
				int multiploDe4 = playersCount
				// sacar cual es el siguiente multiplo de 4 segun el numero de
				// jugadores
				while ((multiploDe4 % 4) != 0) {
					multiploDe4++
				}
				// el siguiente multiplo de 4 menos el numero de jugadores es
				// el numero de grupos de 3
				groupsOf3 = multiploDe4 - playersCount
				// la resta del resultado de la division del numero de jugadores
				// entre 4 y la distancia del numero de jugadores a el siguiente
				// multiplo de 4 (o el numero de grupos de 3) es el numero de
				// de grupos de 4
				groupsOf4 = (multiploDe4 / 4) - groupsOf3
				break
			default:
				return 0
				break
		}

		return groupsOf3 + groupsOf4
	}


}
