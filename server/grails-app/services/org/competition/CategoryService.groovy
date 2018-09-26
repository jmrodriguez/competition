package org.competition

import grails.gorm.transactions.Transactional

@Transactional
class CategoryService {

    /**
     * Gets the categories
     * @return
     */
    Object[] listCategories(String textFilter, Map metaParams) {
        ArrayList categories
        Map parameters = [:]
        long categoriesCount

        String selectQuery = "from Category c"
        String countQuery = "select count(c) from Category c"

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

        categories = Category.executeQuery(selectQuery, parameters, metaParams)
        categoriesCount = Category.executeQuery(countQuery, parameters)[0].toString() as Long

        return [categories, categoriesCount]
    }
}
