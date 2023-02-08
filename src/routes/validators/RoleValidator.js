
const { body } = require('express-validator');

module.exports = {

    roleValidator: [
        body('role_name').isString().not().isEmpty(),
        body('role_description').isString().not().isEmpty(),
        body('section').isString().not().isEmpty(),
    ]

}