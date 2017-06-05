import org.competition.Country
import org.competition.Role
import org.competition.User
import org.competition.UserRole

class BootStrap {

    Role rolSysadmin, rolFederacionAdmin

    def init = { servletContext ->

        this.addCountries()

        this.addRoles()
        if(!User.count()){
            this.addUsers()
        }    }
    def destroy = {
    }

    private void addCountries() {
        if(!Country.count()) {
            Country country1 = new Country(name:'Costa Rica', isoCode: 'CRC')
            country1.save(failOnError:true)
        }
    }

    private void addRoles() {
        if(!Role.findByAuthority('ROLE_ADMIN')){
            rolSysadmin = new Role(authority: 'ROLE_ADMIN', name:'System Administrator').save(failOnError:true)
        }
        if(!Role.findByAuthority('ROLE_FEDERATION_ADMIN')){
            rolFederacionAdmin = new Role(authority: 'ROLE_FEDERATION_ADMIN', name:'Federation Admin').save(failOnError:true)
        }
    }

    private void addUsers() {
        User sysadmin = new User(email:'juan.manuel.rodriguez@gmail.com', password:'password', firstName:'Juan Manuel', lastName:'Rodriguez', enabled:true).save(failOnError:true)

        UserRole.create(sysadmin, rolSysadmin)
    }

}
