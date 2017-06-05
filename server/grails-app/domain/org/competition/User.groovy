package org.competition

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='email')
@ToString(includes='email', includeNames=true, includePackage=false)
class User implements Serializable {

	private static final long serialVersionUID = 1

	transient springSecurityService

	String email
	String password = "tempPassword"
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	Date lastLoginDate
	String firstName
	String lastName

	User(String email, String password) {
		this()
		this.email = email
		this.password = password
	}

	Set<Role> getAuthorities() {
		UserRole.findAllByUser(this)*.role
	}

	def beforeInsert() {
		encodePassword()
	}

	def beforeUpdate() {
		if (isDirty('password')) {
			encodePassword()
		}
	}

	protected void encodePassword() {
		password = springSecurityService?.passwordEncoder ? springSecurityService.encodePassword(password) : password
	}

	static transients = ['springSecurityService', 'getFullName']

	static mapping = {
		password column: '`password`'
	}

	static constraints = {
		lastLoginDate nullable:true
		password blank: false
		email blank:false, email: true, unique: true
	}

	String getFullName(){
		"${firstName} ${lastName}"
	}
}
