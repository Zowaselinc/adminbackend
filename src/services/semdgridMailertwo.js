
"use strict";

const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

require('dotenv').config();

const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  };
   const transporter = nodemailer.createTransport(sgTransport(options));

const sendhtmlEMAIL=async (email,subject,html)=>{try {
    // send mail with defined transport object
let info = await transporter.sendMail({
    from: process.env.SENDGRID_FROM, // sender address
    to: email, // list of receivers
    // bcc: "devruthani@gmail.com",
    subject: subject, // Subject line
   
    html:html, // html body
  });
  console.log(info);
} catch (error) {
    console.log(error);
}

}
const sendhtmlEMAILBATCH=async (recipients,subject,html)=>{try {


    recipients.forEach(async element => {
            
    // send mail with defined transport object
let info = await transporter.sendMail({
    from: process.env.SENDGRID_FROM, // sender address
    to: element.email, // list of receivers
    subject: subject, // Subject line
   
    html:html, // html body
  });
  console.log(info);
    });


} catch (error) {
    console.log(error);
}

}
module.exports = {sendhtmlEMAIL,sendhtmlEMAILBATCH};

