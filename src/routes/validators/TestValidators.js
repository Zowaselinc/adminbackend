const { body } = require('express-validator');

module.exports = {

    testValidator : [
        body('name').isString(),
    ],

}