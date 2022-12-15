

const { request } = require("express");
const { validationResult } = require("express-validator");
const {Message, ErrorLog } = require("~database/models");
const crypto = require('crypto');
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");

class MessageController{
/* ----------------------- CREATE/ADD MESSAGE END POINT ----------------------- */
    static async createMessage(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

            const messageid = crypto.randomBytes(16).toString("hex")
            var themessage = await Message.create({
                message_id: messageid,
                sender_id:req.body.sender_id,
                receiver_id:req.body.receiver_id,
                message:req.body.message,
                message_type:req.body.message_type,
            });
                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Create Message',
            page_route:'/api/admin/message/add',
            action:'Composed and sent a message'
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(themessage){
                return res.status(200).json({
                    error : false,
                     message : "Message created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create Message"
  
                 });

                 

            }
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Message",
                error_description: e.toString(),
                route: "/api/admin/message/add",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                    
                })

            }

        }
    }
    /* -------------------------------------------------------------------------- */


      /* --------------------------- GET MESSGAE BY PARAMS -------------------------- */
      static async getMessagesbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var messageparams = await Message.findAll({
            limit:limit,
            offset:offset
        });

                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);

                await Activitylog.create({
                  admin_id:adminId ,
                  section_accessed:'View messages by offset and limit',
                  page_route:'/api/admin/message/getallparams',
                  action:'Viewing messages '
              });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(messageparams){
            return res.status(200).json({
                error: false,
                message: 'Messages acquired successfully',
                data: messageparams
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
            route: "/api/admin/message/getallparams/:offset/:limit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
                
            })

        }
    }

    }

    /* --------------------- GET MESSAGE BY  ID ENDPOINT --------------------- */
    static async getMessagebyid(req,res){
        try{

        var messagesent = await Message.findOne({where: {sender_id : req.params.id}});
        var messagereceived = await Message.findOne({where: {receiver_id : req.params.id}});
      console.log(messagesent)
        var allMessages = messagesent.concat(messagereceived);
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);

               await Activitylog.create({
                 admin_id:adminId ,
                 section_accessed:'View message by id',
                 page_route:'/api/admin/message/getbyid/:id',
                 action:'Viewing message'
             });
              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(allMessages.length<1){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Message acquired successfully',
                data: allMessages
            })
        }
    }catch(e){
        
        var logError = await ErrorLog.create({
            error_name: "Error on getting message by id",
            error_description: e.toString(),
            route: "/api/admin/messgae/getbyid/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
                
                
            })

        }
    }
    }


    

    /* ---------------------- EDIT MESSAGE BY ID END POINT ---------------------- */
    static async editMessage(req, res){
        try{

        var editmessage = await Message.update({
           message:req.body.message,
           message_type:req.body.message_type
        }, { where : { id : req.body.id } });

                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);

                await Activitylog.create({
                  admin_id:adminId ,
                  section_accessed:'Edit Message',
                  page_route:'/api/admin/message/edit',
                  action:'Edited a message'
              });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(editmessage){
            return res.status(200).json({
                error: false,
                message: "Message edited successfully",
                data: editmessage
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
            route: "/api/admin/message/edit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
                
            })

        }
    }
    }

    /* ------------------------ DELETE MESSAGE BY ID ------------------------ */
    static async deleteMessage(req, res){
        try{

        var delmessage = await Message.destroy({ where : {id : req.params.id}});
      /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Delete Message',
            page_route:'/api/admin/message/delete/:id',
            action:'Deleted a message'
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(delmessage){
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
            route: "/api/admin/message/delete/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            })

        }
    }
    }

}

module.exports = MessageController;

    