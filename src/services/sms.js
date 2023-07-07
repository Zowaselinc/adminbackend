const express = require('express');
const app = express();
require('dotenv').config();
const axios = require('axios');



// Replace with your SendGrid API key
const api_key = process.env.SMS_API_KEY;

const sendSms=async(phone, sms)=>{  

    const requestData = {
        to: phone, // Recipient's phone number
        from: process.env.SMS_FROM, // Your SendGrid phone number
        sms: sms, // SMS text body
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
        // response.status(200).json({ message: 'SMS sent successfully!' });
    })
    .catch(error => {
        // response.status(400).json({ message: "Oops! failed to send sms" });
    })
    
}
module.exports = {sendSms}

