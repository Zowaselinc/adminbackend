

const { request } = require("express");
const { validationResult } = require("express-validator");
const {Message, ErrorLog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

class MessageController{
/* ----------------------- CREATE/ADD MESSAGE END POINT ----------------------- */
    static async createMessage(req, res){
        try{

            var themessage = await Message.create({
                message_id:req.bopdy.message_id,
                sender_id:req.body.sender_id,
                receiver_id:req.body.receiver_id,
                message:req.body.message,
                message_type:req.body.message_type,
            });

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


/* ------------------------ GET ALL MESSAGE END POINT ------------------------ */
            static async getAllMessages(req, res){
                try{

                var allmessages = await Message.findAll();
                if(allmessages){
                    return res.status(200).json({
                        error : false,
                        message: "Messages acquired successfully",
                        data : allmessages
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to acquire Messages",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all messages",
                    error_description: e.toString(),
                    route: "/api/admin/message/getall",
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

      /* --------------------------- GET MESSGAE BY PARAMS -------------------------- */
      static async getMessagesbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var messageparams = await Message.findAll({
            limit:limit,
            offset:offset
        });
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

        var messageid = await Message.findOne({where: {id : req.params.id}});
        if(messageid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Message acquired successfully',
                data: messageid
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

        if(editmessage== null){
            return res.status(200).json({
                error: true,
                message: "Not found"
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Message edited succesfully",
                data : editmessage
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

        if(delmessage == null){
            return res.send(200).json({
                error : true,
                message : "Not found",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Message deleted successfully",
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

    