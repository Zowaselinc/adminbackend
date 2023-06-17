

const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const jwt = require("jsonwebtoken");
const { sendhtmlEMAIL, sendhtmlEMAILBATCH } = require("~services/semdgridMailertwo");

class emailController{
    static async sendEmail(req, res){
        
      await mailer().to(req.body.email).from(process.env.SENDGRID_FROM)
        .subject('Verify').template("emails/WelcomeEmail").send();


        return res.status(200).json({
            error : false,
             message : "Message sent successfully"

         });
        }

        /* --------------------------- // individual mails -------------------------- */
        static async singleMail(req, res){
        
        sendhtmlEMAIL(req.body.email,req.body.subject,req.body.html);
    
            return res.status(200).json({
                error : false,
                 message : "Email sent successfully"
    
             });
            }

        /* --------------------------- //  SEND BULK EMAIL -------------------------- */
        static async sendBulkmails(req, res){
        
          sendhtmlEMAILBATCH(req.body.recipients,req.body.subject,req.body.html);
    
    
            return res.status(200).json({
                error : false,
                 message : "Bulk Emails sent successfully"
    
             });
            }







    }



module.exports = emailController;

    