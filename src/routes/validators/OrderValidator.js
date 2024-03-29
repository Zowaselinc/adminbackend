
const { body } = require('express-validator');
module.exports = {
     
    createOrderValidator : [
        body('buyer_id').isNumeric().not().isEmpty(),
        body('buyer_type').isString().not().isEmpty(),
        body('negotiation_id').isString(),
        body('payment_option').isString(),
        body('payment_status').isString().not().isEmpty()
    ],

    updateTrackingDetailsValidators : [
        body('order_id').isString().not().isEmpty(),
        body('tracking_details.pickupstation.tracking_description').isString().not().isEmpty(),
        body('tracking_details.pickupstation.location').isString().not().isEmpty(),
        body('tracking_details.pickupstation.pickup_date').isString().not().isEmpty(),
        body('tracking_details.shipping.tracking_description').isString().not().isEmpty(),
        body('tracking_details.shipping.location').isString(),
        body('tracking_details.shipping.shipping_date').isString(),
        body('tracking_details.delivered.tracking_description').isString().not().isEmpty(),
        body('tracking_details.delivered.location').isString(),
        body('tracking_details.delivered.delivered_date').isString()
    ],

    updateWaybillDetailsValidators : [
        body('waybill_details.dispatch_section.from').isString(),
        body('waybill_details.dispatch_section.to').isString(),
        body('waybill_details.dispatch_section.date').isString(),
        body('waybill_details.dispatch_section.consignee').isString(),
        body('waybill_details.dispatch_section.truck_number').isString(),
        body('waybill_details.dispatch_section.remarks').isString(),
        body('waybill_details.dispatch_section.items').not().isEmpty(),
        body('waybill_details.dispatch_section.drivers_data').not().isEmpty(),
        body('waybill_details.dispatch_section.sellers_data').not().isEmpty(),
        body('waybill_details.receipt_section.items').not().isEmpty(),
        body('waybill_details.receipt_section.remarks').isString(),
        body('waybill_details.receipt_section.sellers_data').not().isEmpty(),
        body('waybill_details.receipt_section.recipient_data').not().isEmpty(),

    ],

    updateGoodReceiptDetailsValidators : [
        
        body('order_id').isString().not().isEmpty(),
        body('good_receipt_note.crop_description').isString().not().isEmpty(),
        body('good_receipt_note.packaging').isString().not().isEmpty(),
        body('good_receipt_note.no_of_bags').isNumeric().not().isEmpty(),
        body('good_receipt_note.gross_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.tare_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.net_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.rejected_quantity').isString().not().isEmpty(),
        body('good_receipt_note.accepted_quantity').isString().not().isEmpty(),
        body('good_receipt_note.rate').isString().not().isEmpty(),
        body('good_receipt_note.discount').isString().not().isEmpty(),
        body('good_receipt_note.total_value').isString().not().isEmpty()
    ],




    InputOrderValidator: [
        body('user_id').isString().not().isEmpty(),
        body('delivery_address_id').isString().not().isEmpty(),
        body("total_price").isNumeric().not().isEmpty(),
        body('delivery_method').isString().not().isEmpty(),
        body('payment_method').isString().not().isEmpty(),
        body('orders').isString().not().isEmpty()
    ],

    updateOrderValidator: [
        body('order_id').isString().not().isEmpty(),
        body('payment_status').isString().not().isEmpty()
    ],

    createCartOrderValidator : [
        body('delivery_details').not().isEmpty(),
    ],
}
