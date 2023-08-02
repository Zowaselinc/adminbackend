

const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog, Activitylog } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const serveAdminid = require("~utilities/serveAdminId");

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

            try{
        
        sendhtmlEMAIL(req.body.email,req.body.subject,req.body.html);

         /* ------------------------------ activity log ------------------------------ */
         var adminId = await  serveAdminid.getTheId(req);                    
         await Activitylog.create({
         admin_id:adminId ,
         section_accessed:'Sending email',
         page_route:'/api/admin/email/singlemail',
         action:'sent an email'
     });
     //   end
    
            return res.status(200).json({
                error : false,
                 message : "Email sent successfully"
    
             });

            }catch(error){
                var logError = await ErrorLog.create({
                    error_name: "Error on sending email",
                    error_description: error.toString(),
                    route: "/api/admin/email/singlemail",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment'+ "" + error.toString(),
                        
                    });
            }
            
            }
            }

        /* --------------------------- //  SEND BULK EMAIL -------------------------- */
        static async sendBulkmails(req, res){
            try{  
        
          sendhtmlEMAILBATCH(req.body.recipients,req.body.subject,req.body.html);

           /* ------------------------------ activity log ------------------------------ */
           var adminId = await  serveAdminid.getTheId(req);                    
           await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Sending bulk email',
           page_route:'/api/admin/email/bulkmail',
           action:'sent an sms'
       });
       //   end
    
    
            return res.status(200).json({
                error : false,
                 message : "Bulk Emails sent successfully"
    
             });


            }catch(error){
                var logError = await ErrorLog.create({
                    error_name: "Error on sending bulk email",
                    error_description: error.toString(),
                    route: "/api/admin/email/bulkmail",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment'+ "" + error.toString(),
                        
                    });
            }

            }

            }

            // /* ------------------------ store emails on database ------------------------ */
            // static async storeEmails(req, res){
            //     try{

            //     }catch(error){
            //         var logError = await ErrorLog.create({
            //             error_name: "Error on  email",
            //             error_description: error.toString(),
            //             route: "/api/admin/email/bulkmail",
            //             error_code: "500"
            //         });
            //         if(logError){
            //             return res.status(500).json({
            //                 error: true,
            //                 message: 'Unable to complete request at the moment'+ "" + error.toString(),
                            
            //             });
            //     }

            //     }
            // }





    }



module.exports = emailController;

    