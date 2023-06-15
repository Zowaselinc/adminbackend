"use strict";

const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

require('dotenv').config();

const Utilities = require('~utilities/file');

const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  };

  const transporter = nodemailer.createTransport(sgTransport(options));


class Mailer{

    constructor() {
        this.Mail = { text: "" };
      }

    from(from){
        this.Mail.from = from;
        return this;
    }


    subject(subject){
        this.Mail.subject = subject;
        return this;
    }


    to(recipient){
        this.Mail.to = recipient;
        return this;
    }

    text(text){
        this.Mail.text = text;
        return this;
    }

    template(template, data = {}){
        this.Mail.html = Utilities.loadTemplate(template, data);
        return this;
    }

    async send(){
        

        let send = await transporter.sendMail(this.Mail);
        console.log(send);
        return send;
    }

    
}

module.exports = () => new Mailer();

