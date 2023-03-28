const { body } = require('express-validator');

module.exports = {

    updateAccountValidator: [
        body('first_name').isString().notEmpty(),
        body('last_name').isString().notEmpty(),
        body('phone').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('city').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('dob').isString().notEmpty(),
        body('gender').isString().notEmpty(),
    ],

    updateCompanyValidator: [
        body('company_name').isString().notEmpty(),
        body('company_address').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('company_email').isString().notEmpty(),
        body('company_phone').isString().notEmpty(),

    ],

    changePasswordValidator: [
        body('current_password').isString(),
        body('new_password').isString(),
        body('confirm_password').isString()
    ],


    startKYC: [
        body('id_type').isString().matches('^(passport|voter_id|ssn|social_insurance|tax_id|identity_card|driving_licence|share_code)'),
        body('id_number').not().isEmpty(),
        body('first_name').not().isEmpty(),
        body('last_name').not().isEmpty(),
        body('phone_number').not().isEmpty(),
        body('country').not().isEmpty(),
        body('state').not().isEmpty(),
        body('city').not().isEmpty(),
        body('address').not().isEmpty(),
        body('dob').not().isEmpty(),
        body('gender').isString().matches('^(male|female)'),
        body('bvn').not().isEmpty(),
    ],

    retriveCheck: [
        body('id').not().isEmpty(),
    ],

    listCheck: [
        body('applicant_id').not().isEmpty(),
    ],

    downloadCheck: [
        body('id').not().isEmpty(),
    ],

    startKYB: [
        body('tax_id').not().isEmpty(),
        body('cac').not().isEmpty(),
        body('financial_statement').not().isEmpty(),
        body('mou').not().isEmpty(),
        

    ],

    kycDocs: [
        body('user_id').not().isEmpty(),
        body('id_type').not().isEmpty(),
        body('id_front').not().isEmpty(),
        body('id_back').not().isEmpty(),
        body('id_number').not().isEmpty(),

    ],



}