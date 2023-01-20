
const { body } = require('express-validator');

module.exports = {

    addColourValidator : [
        body('colour_id').isNumeric(),
        body('colour_name').isString(),
    ]

}