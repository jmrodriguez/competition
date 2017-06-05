package org.competition

import grails.gorm.DetachedCriteria
import org.apache.commons.lang.builder.HashCodeBuilder

/**
 * @author Ricardo Vargas Del Valle
 * ricvargas@hotmail.com
 */
class UserFederation implements Serializable {

	private static final long serialVersionUID = 1

	User user
	Federation federation

    UserFederation(User u, Federation f) {
		this()
		user = u
		federation = f
	}

	@Override
	boolean equals(other) {
		if (!(other instanceof UserFederation)) {
			return false
		}

		other.user?.id == user?.id && other.federation?.id == federation?.id
	}

	@Override
	int hashCode() {
		def builder = new HashCodeBuilder()
		if (user) builder.append(user.id)
		if (federation) builder.append(federation.id)
		builder.toHashCode()
	}
	
	static UserFederation get(long userId, long federationId) {
		criteriaFor(userId, federationId).get()
	}

	static boolean exists(long userId, long federationId) {
		criteriaFor(userId, federationId).count()
	}

	private static DetachedCriteria criteriaFor(long userId, long federationId) {
		UserFederation.where {
			user == User.load(userId) &&
			federation == Federation.load(federationId)
		}
	}

	static UserFederation create(User user, Federation federation, boolean flush = false) {
		def instance = new UserFederation(user: user, federation: federation)
		instance.save(flush: flush, insert: true)
		instance
	}

	static boolean remove(User u, Federation r, boolean flush = false) {
		if (u == null || r == null) return false

		int rowCount = UserFederation.where { user == u && federation == r }.deleteAll()

		if (flush) { UserFederation.withSession { it.flush() } }

		rowCount
	}

	static void removeAll(User u, boolean flush = false) {
		if (u == null) return

		UserFederation.where { user == u }.deleteAll()

		if (flush) { UserFederation.withSession { it.flush() } }
	}

	static void removeAll(Federation r, boolean flush = false) {
		if (r == null) return

		UserFederation.where { federation == r }.deleteAll()

		if (flush) { UserFederation.withSession { it.flush() } }
	}

	static constraints = {
		federation validator: { Federation r, UserFederation ur ->
			if (ur.user == null || ur.user.id == null) return
			boolean existing = false
			UserFederation.withNewSession {
				existing = UserFederation.exists(ur.user.id, r.id)
			}
			if (existing) {
				return 'userFederation.exists'
			}
		}
	}

	static mapping = {
		id composite: ['user', 'federation']
		version false
	}
		
	
}
