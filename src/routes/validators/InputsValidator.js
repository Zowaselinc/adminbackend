const { body } = require('express-validator');

module.exports = {

    createInputValidator: [
        body('user_id').isString().not().isEmpty(),
        body('category_id').isString().not().isEmpty(),
        body('subcategory_id').isString().not().isEmpty(),
        body('product_type').isString().not().isEmpty(),
        body('crop_focus').isString().not().isEmpty(),
        body('packaging').isString().not().isEmpty(),
        body('description').isString().not().isEmpty(),
        body('stock').isString().not().isEmpty(),
        body('usage_instruction').isString().not().isEmpty(),
        body('kilograms').isString().not().isEmpty(),
        body('grams').isString().not().isEmpty(),
        body('liters').isString().not().isEmpty(),
        body('price').isString().not().isEmpty(),
        body('currency').isString().not().isEmpty(),
        body('manufacture_name').isString().not().isEmpty(),
        body('manufacture_date').isString().not().isEmpty(),
        body('delivery_method').isString().not().isEmpty(),
        body('expiry_date').isString().not().isEmpty(),
        body('manufacture_country').isString().not().isEmpty(),
        body('state').isString().not().isEmpty()
       
    ]

}