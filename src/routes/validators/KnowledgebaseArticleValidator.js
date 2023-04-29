
const { body } = require('express-validator');

module.exports = {

    articleValidator: [
        body('title').isString().not().isEmpty(),
        body('body').isString().not().isEmpty(),
        body('category_id').isString().not().isEmpty(),
        
    ]

}