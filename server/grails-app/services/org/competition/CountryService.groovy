package org.competition

import grails.gorm.transactions.Transactional

@Transactional
class CountryService {

    /**
     * Gets the countries
     * @return
     */
    Object[] listCountries(String textFilter, Map metaParams) {
        ArrayList countries
        Map parameters = [:]
        long countriesCount

        String selectQuery = "from Country c"
        String countQuery = "select count(c) from Country c"

        if (textFilter) {
            selectQuery = selectQuery + " where (c.name like :textFilter)"
            countQuery = countQuery + " where (c.name like :textFilter)"
            parameters = ["textFilter": "%${textFilter}%"]
        }
        if (metaParams.sort) {
            String sort = metaParams.sort
            String order = metaParams.order
            if (order == null) {
                order = "asc"
            }
            selectQuery = selectQuery + " order by c." + sort + " " + order
        }

        countries = Country.executeQuery(selectQuery, parameters, metaParams)
        countriesCount = Country.executeQuery(countQuery, parameters)[0].toString() as Long

        return [countries, countriesCount]
    }
}
