

const { request } = require("express");
const { validationResult } = require("express-validator");
const {Sms, ErrorLog, Activitylog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class AdminsmsController{
/* ----------------------- SEND SMS END POINT ----------------------- */
    static async sendSms(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

            const messageId = crypto.randomBytes(16).toString("hex")
            var sendSms = await Sms.create({
                admin:req.body.admin,
                message_id: messageId,
                subject:req.body.subject,
                message:req.body.message,
                contact:req.body.contact
                
            });
                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'sending sms',
            page_route:'/api/admin/sms/send',
            action:'sent sms'
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(sendSms){
                return res.status(200).json({
                    error : false,
                     message : "Message sent succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to send Message"
  
                 });

                 

            }
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on sending sms",
                error_description: e.toString(),
                route: "/api/admin/sms/send",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+ "" + e.toString(),
                    
                })

            }

        }
    }
    /* -------------------------------------------------------------------------- */


      /* --------------------------- GET SMSBY PARAMS -------------------------- */
      static async getSmsbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var smsparams = await Sms.findAll({
            limit:limit,
            offset:offset
        });

                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);

                await Activitylog.create({
                  admin_id:adminId ,
                  section_accessed:'View sms by offset and limit',
                  page_route:'/api/admin/sms/getallparams',
                  action:'Viewing messages '
              });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(smsparams){
            return res.status(200).json({
                error: false,
                message: 'Messages acquired successfully',
                data: smsparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Message',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Messages by paprams",
            error_description: e.toString(),
            route: "/api/admin/sms/getallparams/:offset/:limit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+""+e.toString(),
                
            })

        }
    }

    }

    /* --------------------- GET SMS BY  ID ENDPOINT --------------------- */
    static async getSmsbyid(req,res){
        try{

        
        var singleSms = await Sms.findOne({where:{id:req.params.id}})
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);

               await Activitylog.create({
                 admin_id:adminId ,
                 section_accessed:'View message by id',
                 page_route:'/api/admin/sms/getbyid/:id',
                 action:'Viewing message'
             });
              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(singleSms==null){
            return res.status(200).json({
                error:true,
                message: 'Not found! invalid id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Message acquired successfully',
                data: singleSms
            })
        }
    }catch(e){
        
        var logError = await ErrorLog.create({
            error_name: "Error on getting message by id",
            error_description: e.toString(),
            route: "/api/admin/sms/getbyid/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+""+e.toString(),
                
                
            })

        }
    }
    }

        /* ----------------------------- GET SMS BY AMIN ---------------------------- */




    /* --------------------- GET SMS BY  ID ENDPOINT --------------------- */
    static async getSmsbyAdmin(req,res){
        try{

        
        var viewByadmin =await Sms.findOne({where:{admin:req.params.admin}})
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);

               await Activitylog.create({
                 admin_id:adminId ,
                 section_accessed:'View message by admin',
                 page_route:'/api/admin/sms/byadmin/:admin',
                 action:'Viewing message'
             });
              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(viewByadmin == null){
            return res.status(200).json({
                error:true,
                message: 'Not found! invalid admin id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Message acquired successfully',
                data: viewByadmin
            })
        }
    }catch(e){
        
        var logError = await ErrorLog.create({
            error_name: "Error on getting message by admin",
            error_description: e.toString(),
            route: "/api/admin/sms/byadmin/:admin",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+""+e.toString(),
                
                
            })

        }
    }
    }



        /* -------------------------- GET SMS BY MESSAGE ID ------------------------- */
        static async getsmsBymessageid(req,res){
            try{
    
            
            var viewBymessageid = await Sms.findOne({where:{message_id:req.params.message_id}})
                   /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
    
                   await Activitylog.create({
                     admin_id:adminId ,
                     section_accessed:'View sms by message id',
                     page_route:'/api/admin/sms/messageid/:message_id',
                     action:'Viewing sms'
                 });
                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(viewBymessageid==null){
                return res.status(200).json({
                    error:true,
                    message: 'Not found! invalid message id'
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: 'Message acquired successfully',
                    data: viewBymessageid
                })
            }
        }catch(e){
            
            var logError = await ErrorLog.create({
                error_name: "Error on getting sms by message id",
                error_description: e.toString(),
                route: "/api/admin/sms/messageid/:message_id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+""+e.toString(),
                    
                    
                })
    
            }
        }
        }
    
        /* ------------------------------- get all sms ------------------------------ */

        /* ------------------------ GET ALL ADMINS END POINT ------------------------ */
        static async getAllSms(req, res){
          
            try{

            var allSms = await Sms.findAll();
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);
               await Activitylog.create({
                   admin_id:adminId ,
                   section_accessed:'View All sms',
                   page_route:'/api/admin/sms/getall',
                   action:'Viewing all sms in the list'
               });
                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(allSms){
                return res.status(200).json({
                    error : false,
                    message: "messages acquired successfully",
                    data :allSms
                });

            }else{
                return res.status(200).json({
                    error : true,
                    message: "Unable to acquire messages",
                });

            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all sms",
                error_description: e.toString(),
                route: "/api/admin/sms/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+""+e.toString(),
                    
                })

            }
        }
        }
    

    /* ---------------------- EDIT SMS BY ID END POINT ---------------------- */
    static async editSms(req, res){
        try{

        var editsms = await Sms.update({
            subject:req.body.subject,
            message:req.body.message,
            contact:req.body.contact
        }, { where : { id : req.body.id } });

                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);

                await Activitylog.create({
                  admin_id:adminId ,
                  section_accessed:'Edit Message',
                  page_route:'/api/admin/sms/edit',
                  action:'Edited a message'
              });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(editsms ){
            return res.status(200).json({
                error: false,
                message: "Message edited successfully",
               
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit message",
               
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting Message ",
            error_description: e.toString(),
            route: "/api/admin/sms/edit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+""+e.toString(),
                
            })

        }
    }
    }

    /* ------------------------ DELETE SMS BY ID ------------------------ */
    static async deleteSms(req, res){
        try{

        var delsms = await Sms.destroy({ where : {id : req.params.id}});
      /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Delete Message',
            page_route:'/api/admin/sms/delete/:id',
            action:'Deleted a message'
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(delsms){
            return res.send(200).json({
                error : false,
                message : "message deleted successfully",
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete message",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Message",
            error_description: e.toString(),
            route: "/api/admin/sms/delete/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+""+e.toString(),
            })

        }
    }
    }

}

module.exports = AdminsmsController;

    