
const { body } = require('express-validator');

module.exports = {

    loginAdminValidator : [
        body('email').isString().isEmail(),
        body('password').isString()
    ]
   

}