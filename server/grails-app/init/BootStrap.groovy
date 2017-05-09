import org.competition.Country

class BootStrap {

    def init = { servletContext ->

        this.addCountries()

        //this.addRoles()
        /*if(!User.count()){
            this.addUsers()
        }*/
    }
    def destroy = {
    }

    private void addCountries() {
        if(!Country.count()) {
            Country country1 = new Country(name:'Costa Rica',
                    isoCode: 'CRC'
            )
            country1.save(failOnError:true)
        }
    }

}
