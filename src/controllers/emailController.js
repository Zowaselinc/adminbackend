

const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const jwt = require("jsonwebtoken");
const mailer = require("../services/mailer");

class emailController{
    static async sendEmail(req, res){
        
      await mailer().to(req.body.email).from(process.env.MAIL_FROM)
        .subject('Verify').template("emails/WelcomeEmail").send();


        return res.status(200).json({
            error : false,
             message : "Message created succesfully"

         });

    }







    }



module.exports = emailController;

    