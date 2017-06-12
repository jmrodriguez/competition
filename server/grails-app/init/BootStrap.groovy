import org.competition.Country
import org.competition.Federation
import org.competition.Role
import org.competition.User
import org.competition.UserRole
import org.competition.Weight
import org.competition.Category

class BootStrap {

    Role rolSysadmin, rolFederacionAdmin, rolGeneralAdmin

    def init = { servletContext ->

        this.addCountries()
        this.addFederations()

        this.addRoles()
        if(!User.count()){
            this.addUsers()
        }

        this.addWeights()
        this.addCategories()
    }
    def destroy = {
    }

    private void addCountries() {
        if(!Country.count()) {
            Country country1 = new Country(name:'Costa Rica', isoCode: 'CRC')
            country1.save(failOnError:true)
        }
    }

    private void addRoles() {
        if(!Role.findByAuthority('ROLE_SUPER_ADMIN')){
            rolSysadmin = new Role(authority: 'ROLE_SUPER_ADMIN', name:'System Administrator').save(failOnError:true)
        }
        if(!Role.findByAuthority('ROLE_FEDERATION_ADMIN')){
            rolFederacionAdmin = new Role(authority: 'ROLE_FEDERATION_ADMIN', name:'Federation Admin').save(failOnError:true)
        }

        if(!Role.findByAuthority('ROLE_GENERAL_ADMIN')){
            rolGeneralAdmin = new Role(authority: 'ROLE_GENERAL_ADMIN', name:'General Admin').save(failOnError:true)
        }
    }

    private void addUsers() {
        User sysadmin = new User(email:'juan.manuel.rodriguez@gmail.com', password:'password', firstName:'Juan Manuel', lastName:'Rodriguez', enabled:true).save(failOnError:true)

        UserRole.create(sysadmin, rolSysadmin)

        User fedAdmin = new User(email:'fedAdmin@gmail.com', password:'password', firstName:'Federation', lastName:'Admin', enabled:true).save(failOnError:true)

        UserRole.create(fedAdmin, rolFederacionAdmin)

        User generalAdmin = new User(email:'genAdmin@gmail.com', password:'password', firstName:'General', lastName:'Admin', enabled:true).save(failOnError:true)

        UserRole.create(generalAdmin, rolGeneralAdmin)
    }

    private void addFederations() {
        if(!Federation.count()) {
            Federation fecoteme = new Federation(name: "FECOTEME", description: "Descripcion FECOTEME", country: Country.findById(1))
            fecoteme.save(failOnError:true)
        }
    }

    private void addWeights() {
        if(!Weight.count()) {
            Weight defaultWeight = new Weight(name:'Default Weight', factor: 1)
            defaultWeight.save(failOnError:true)
        }
    }

    private void addCategories() {
        if(!Category.count()) {
            Category open = new Category(name:"Open")
            open.save(failOnError:true)
        }
    }

}
