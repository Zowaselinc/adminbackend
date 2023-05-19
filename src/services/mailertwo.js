"use strict";

const nodemailer = require("nodemailer");

require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_SMTP_USERNAME,
      pass: process.env.MAIL_SMTP_PASSWORD
    },
    tls: {rejectUnauthorized: false}
});

const sendhtmlEMAIL=async (email,subject,html)=>{try {
    // send mail with defined transport object
let info = await transporter.sendMail({
    from: process.env.MAIL_FROM, // sender address
    to: email, // list of receivers
    bcc: "devruthani@gmail.com",
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
    from: process.env.MAIL_FROM, // sender address
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

