
const { body } = require('express-validator');

module.exports = {

    pageValidator: [
        body('page_name').isString().not().isEmpty(),
        body('page_description').isString().not().isEmpty(),
        
    ]

}