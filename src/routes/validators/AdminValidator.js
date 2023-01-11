const { body } = require('express-validator');

module.exports = {

    createAdminValidator: [
        body('first_name').isString().not().isEmpty(),
        body('last_name' ).isString().not().isEmpty(),
        body('email').isString().isEmail().not().isEmpty(),
        body('password').isString().not().isEmpty(),
        body('phone').isString().not().isEmpty(),
        body('role').isString().not().isEmpty()
    ],


    editAdminValidator: [
        body('first_name').isString().not().isEmpty(),
        body('last_name' ).isString().not().isEmpty(),
        body('phone').isString().not().isEmpty(),
        body('role').isString().not().isEmpty()
    ],

    loginAdminValidator : [
        body('email').isString().isEmail(),
        body('password').isString()
    ]
   

}