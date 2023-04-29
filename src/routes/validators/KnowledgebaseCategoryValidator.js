
const { body } = require('express-validator');

module.exports = {

    knowledgebasecategoryValidator: [
        body('category_name').isString().not().isEmpty(),
        body('category_description').isString().not().isEmpty(),
       
    ]

}