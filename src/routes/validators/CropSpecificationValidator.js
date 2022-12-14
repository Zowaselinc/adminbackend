
const { body } = require('express-validator');

module.exports = {

    addCropSpecificationValidator : [
        // body('model_id').isNumeric(),
        body('model_type').isString(),
        body('qty').isNumeric(),
        body('price').isNumeric(),
        body('color').isString(),
        body('moisture').isNumeric(),
        body('foreign_matter').isNumeric(),
        body('broken_grains').isNumeric(),
        body('weevil').isNumeric(),
        body('dk').isNumeric(),
        body('rotten_shriveled').isNumeric(),
        body('test_weight').isString(),
        body('hectoliter').isNumeric(),
        body('hardness').isString(),
        body('splits').isNumeric(),
        body('oil_content').isNumeric(),
        body('infestation').isNumeric(),
        body('grain_size').isString(),
        body('total_defects').isNumeric(),
        body('dockage').isNumeric(),
        body('ash_content').isNumeric(),
        body('acid_ash').isNumeric(),
        body('volatile').isNumeric(),
        body('mold').isNumeric(),
        body('drying_process').isString(),
        body('dead_insect').isNumeric(),
        body('mammalian').isNumeric(),
        body('infested_by_weight').isNumeric(),
        body('curcumin_content').isNumeric(),
        body('extraneous').isNumeric(),
        body('kg').isNumeric(),
        body('liters').isNumeric(),
    ],

}