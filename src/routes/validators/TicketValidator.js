
const { body } = require('express-validator');

module.exports = {

    ticketValidator : [
        body('user_id').isNumeric(),
        body('subject').isString(),
        body('description').isString(),
        body('priority').isString(),
        body('admin_assigned').isString(),
        body('ticket_status').isString(),
 
    ],

}