const express = require('express');
const app = express();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const axios = require('axios');

SECRETKEY="tsk_nqiu638dd7127face02564zyyd"

class SmsController {
    static async sendTheSms(req, res) {

        const requestData = {
            to: req.body.to, // Recipient's phone number
            from: process.env.SMS_FROM, // Your SendGrid phone number
            sms: req.body.sms, // SMS text body
            type: "plain",
            channel: "generic",
            api_key: process.env.SMS_API_KEY
        };
        // Define a route for sending SMS
        const config = {
            headers: {
            'Authorization': `Bearer ${process.env.SMS_SECRETKEY}`,
            }
        };
        axios.post('https://api.ng.termii.com/api/sms/send', requestData, config)
        .then(response => {
            res.status(200).json({ message: 'SMS sent successfully!' });
        })
        .catch(error => {
            res.status(400).json({ message: "Oops! failed to send sms" });
        })
    }

}
module.exports = SmsController;
