
const { body } = require('express-validator');

module.exports = {

    sectionValidator: [
        body('section_name').isString().not().isEmpty(),
        body('section_description').isString().not().isEmpty(),
    ]

}