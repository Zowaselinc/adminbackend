const { body } = require('express-validator');

module.exports = {

    createMessageValidator: [
        body('sender_id').isString().not().isEmpty(),
        body('receiver_id').isString().not().isEmpty(),
        body('message').isString().not().isEmpty(),
        body('message_type').isString().not().isEmpty(),
       
    ]

}