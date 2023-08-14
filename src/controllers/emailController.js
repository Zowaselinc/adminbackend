

const {request} = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog, Activitylog, Email } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const serveAdminid = require("~utilities/serveAdminId");

const jwt = require("jsonwebtoken");
const { sendhtmlEMAIL, sendhtmlEMAILBATCH } = require("~services/semdgridMailertwo");
// const fileUpload = require("express-fileupload");

const { uuid } = require('uuidv4');




class emailController{

    /* ------------------- store or draft newsletters endpoint ------------------ */
    static async draftMail(req,res){
        try{

            var adminId = await  serveAdminid.getTheId(req);

        var draftEmail = await Email.create({
            admin_id:adminId,
            subject: req.body.subject,
            message:req.body.html,
            recipients:req.body.recipients,
            status:req.body.status

        });

        if(draftEmail){
            return res.status(200).json({
                error:false,
                message:"Newsletter drafted successfully"
            })
        }else{
            return res.status(400).json({
                error:true,
                message:"Failed to draft newsletter"
            })
        }
    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on drafting newsletter",
            error_description: error.toString(),
            route: "/api/admin/email/draftmail",
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


    static async sendEmail(req, res){
        
      await mailer().to(req.body.email).from(process.env.SENDGRID_FROM)
        .subject('Verify').template("emails/WelcomeEmail").send();


        return res.status(200).json({
            error : false,
             message : "Message sent successfully"

         });
        }



        /* --------------------------- // individual mails -------------------------- */

        static async singleMail(req,res){
            var adminId = await  serveAdminid.getTheId(req);

            try{
        
        sendhtmlEMAIL( req.body.email,req.body.subject,req.body.html,req.body.status);
        
        /* ------------------------- insert into email table ------------------------ */
            await Email.create({
            admin_id:adminId,
            subject: req.body.subject,
            message:req.body.html,
            recipients:req.body.email,
            status:req.body.status
        });
        
         /* ------------------------------ activity log ------------------------------ */
                             
         await Activitylog.create({
         admin_id:adminId ,
         section_accessed:'Single Email section',
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
        static async sendBulkmails(req,res){
            var adminId = await  serveAdminid.getTheId(req); 
            try{  
        
          sendhtmlEMAILBATCH(req.body.recipients,req.body.subject,req.body.html,req.body.status);

           /* ------------------------- insert into email table ------------------------ */
           await Email.create({
            admin_id:adminId,
            subject: req.body.subject,
            message:req.body.html,
            recipients:JSON.stringify(req.body.recipients),
            status:req.body.status
        });

           /* ------------------------------ activity log ------------------------------ */
                             
           await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Bulk email section',
           page_route:'/api/admin/email/bulkmail',
           action:'sent emails in bulk'
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


             /* ------------------- FETCH ALL EMAILS FROM THE DATABASE ------------------- */
    static async getAllEmails(req,res){
        try{


            var getallmails = await Email.findAll({
                order :[['id', 'DESC']]

            })
            var paramsarray = [];
            await Promise.all( getallmails.map(async (element) => {
                var admininfo = await Admin.findOne({where: {admin_id : element.admin_id}});
                //  admindata.password="";
                // admindata.recovery_phrase="";
                element.dataValues.theadmin= admininfo;
                element._previousDataValues.theadmin= admininfo;
                paramsarray.push(element);
            }));

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


    static async getEmailsbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);

            var getEmailsparams = await Email.findAll({
                limit:limit,
                offset:offset,
                order :[['id', 'DESC']]
            });

            var paramsarray = [];
            await Promise.all( getEmailsparams.map(async (element) => {
                var admininfo = await Admin.findOne({where: {admin_id : element.admin_id}});
                //  admindata.password="";
                // admindata.recovery_phrase="";
                element.dataValues.theadmin= admininfo;
                element._previousDataValues.theadmin= admininfo;
                paramsarray.push(element);
            }));
            

            if(getEmailsparams){
                return res.status(200).json({
                    error: false,
                    message:"Emails fetched  successfully",
                    data:getEmailsparams
                });

            }else{
                return res.status(400).json({
                    error:true,
                    message:"Failed to fetch all email"
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on  fetching emails by ofset and limit",
                error_description: error.toString(),
                route: "/api/admin/email/getbyparams/:offset/:limit",
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

            var mailbyid = await Email.findOne({where:{id:req.params.id}});


            if(mailbyid == null){
                return res.status(400).json({
                    error: true,
                    message:"ID not found",
                    
                });

            }else{
                return res.status(200).json({
                    error:false,
                    message:"Email fetched",
                    data:mailbyid
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on  fetching email by id",
                error_description: error.toString(),
                route: "/api/admin/email/getbyid/:id",
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
    /* -------------------------- get email by admin id ------------------------- */
    static async getEmailbyadminid(req, res){
        try{

            var getmailbyadminid = await Email.findOne({where:{admin_id:req.params.admin_id}})

            if(getmailbyadminid == null){
                return res.status(400).json({
                    error: true,
                    message:"Admin id not found",
                    
                });

            }else{
                return res.status(200).json({
                    error:false,
                    message:"Email fetched successfully",
                    data:getmailbyadminid
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on  fetching email by admin id",
                error_description: error.toString(),
                route: "/api/admin/email/getbyadminid/:admin_id",
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

    