

const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog, Activitylog, Email } = require("~database/models");
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

            /* ------------------------ store emails on database ------------------------ */
            
            static async storeEmails(req, res){
                try{

                    var storeemails = await Email.create({
                        subject: req.body.subject,
                        message:req.body.message,
                        recipients:req.body.recipients,
                        status:req.body.status
                    });

                    if(storeemails){
                        return res.status(200).json({
                            error: false,
                            message:"Email sent successfully",
                            data:storeemails
                        })
                    }else{
                        return res.status(400).json({
                            error:true,
                            message:"Failed to send email"
                        })

                    }

                }catch(error){
                    var logError = await ErrorLog.create({
                        error_name: "Error on  email",
                        error_description: error.toString(),
                        route: "/api/admin/email/storeemail",
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

            /* ------------------- FETCH ALL EMAILS FROM THE DATABASE ------------------- */
            static async getAllEmails(req, res){
                try{

                    var getallmails = await Email.findAll({})

                    if(getallmails){
                        return res.status(200).json({
                            error: false,
                            message:"Emails fetched  successfully",
                            data:getallmails
                        });

                    }else{
                        return res.status(400).json({
                            error:true,
                            message:"Failed to fetch all email"
                        })

                    }
                }catch(error){
                    var logError = await ErrorLog.create({
                        error_name: "Error on  fetching all emails",
                        error_description: error.toString(),
                        route: "/api/admin/email/getall",
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
            /* ----------------------------- GET EMAIL BY ID ---------------------------- */
            static async getEmailbyid(req, res){
                try{

                    var getMailbyid = await Email.findOne({where:{id:req.params.id}})

                    if(getMailbyid.length<1){
                        return res.status(200).json({
                            error: true,
                            message:"ID not found",
                            
                        });

                    }else{
                        return res.status(400).json({
                            error:false,
                            message:"Email fetched",
                            data:getMailbyid
                        })

                    }
                }catch(error){
                    var logError = await ErrorLog.create({
                        error_name: "Error on  fetching email by id",
                        error_description: error.toString(),
                        route: "/api/admin/email/getbyid",
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

            /* ------------------------------- EDITH EMAIL ------------------------------ */
            static async editEmail(req, res){
                try{
                    var editMail = await Email.update({
                        subject: req.body.subject,
                        message:req.body.message,
                        recipients:req.body.recipients,
                        status:req.body.status

                    },{where:{id:req.body.id}});

                    if(editMail){
                        return res.status(200).json({
                            error:false,
                            message:"Email updated successfully",

                        })
                    }else{
                        return res.status(400).json({
                            error: true,
                            message:"Failed to edit email"
                        })
                    }

                }catch(error){
                    var logError = await ErrorLog.create({
                        error_name: "Error on  editing email by id",
                        error_description: error.toString(),
                        route: "/api/admin/email/editemail",
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

            /* ------------------------------ DELETE EMAIL ------------------------------ */

            static async deleteEmail(req, res){
                try{

                    var delEmail = await Email.destroy({where:{id:req.params.id}})
                    if(delEmail){
                        return res.status(200).json({
                            error:false,
                            message:"Email deleted successfully"
                        })
                    }else{
                        return res.status(400).json({
                            error:true,
                            message:"failed to delete Email"
                        })
                    }

                }catch(error){
                    var logError = await ErrorLog.create({
                        error_name: "Error on  deleting email by id",
                        error_description: error.toString(),
                        route: "/api/admin/email/deleteemail/:id",
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





    }



module.exports = emailController;

    