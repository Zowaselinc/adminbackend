


const { request } = require("express");
const { validationResult } = require("express-validator");
const {AdminNotification, ErrorLog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

class Ticket_conversationController{
/* ----------------------- CREATE/ADD ADMIN NOTIFICATION END POINT ----------------------- */
    static async createNotification(req, res){
        try{

            var notification = await AdminNotification.create({
                ticket_id:req.bopdy.ticket_id,
                conversation_id:req.body.conversation_id,
                sender_id:req.body.sender_id,
                message:req.body.message,
                message_type:req.body.message_type,
            });

            if(notification){
                return res.status(200).json({
                    error : false,
                     message : "Admin Notification created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create Admin Notification"
  
                 });

            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Admin Notification",
                error_description: e.toString(),
                route: "/api/admin/notification/add",
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


/* ------------------------ GET ALL ADMIN NOTIFICATION END POINT ------------------------ */
            static async getAllNotification(req, res){
                try{

                var allnotification = await AdminNotification.findAll();
                if(allnotification){
                    return res.status(200).json({
                        error : false,
                        message: "Admin NotificationS acquired successfully",
                        data : allnotification
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to acquire Admin Notification",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Admin Notification",
                    error_description: e.toString(),
                    route: "/api/admin/notification/getall",
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

      /* --------------------------- GET ADMIN NOTIFICATION BY PARAMS -------------------------- */
      static async getNotificationbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var notificationparams = await AdminNotification.findAll({
            limit:limit,
            offset:offset
        });
        if(notificationparams){
            return res.status(200).json({
                error: false,
                message: 'Admin Notification acquired successfully',
                data: notificationparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Admin Notification',
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Admin Notification by paprams",
            error_description: e.toString(),
            route: "/api/admin/notification/getallparams/:offset/:limit",
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

    /* --------------------- GET ADMIN NOTIFICATION BY  ID ENDPOINT --------------------- */
    static async getNotificationbyid(req,res){
        try{

        var notificationid = await AdminNotification.findOne({where: {id : req.params.id}});
        if(notificationid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Admin Notification acquired successfully',
                data: notificationid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Admin Notification by id",
            error_description: e.toString(),
            route: "/api/admin/notification/getbyid/:id",
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

    /* ------------------------- EDIT NOTIFICATION BY ID ------------------------ */

    static async editNotification(req, res){
        try{

        var editmessage = await Message.update({
           notification_status:req.body.notification_status
        }, { where : { id : req.body.id } });

        if(editmessage== null){
            return res.status(200).json({
                error: true,
                message: "Not found"
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Notification status edited succesfully",
                data : editmessage
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting Notification status ",
            error_description: e.toString(),
            route: "/api/admin/notification/edit",
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


    /* ------------------------ DELETE ADMIN NOTIFICATION BY ID ------------------------ */
    static async deleteNotification(req, res){
        try{

        var delnotification = await AdminNotification.destroy({ where : {id : req.params.id}});

        if(delnotification == null){
            return res.send(200).json({
                error : true,
                message : "Not found",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Admin Notification deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Admin Notification",
            error_description: e.toString(),
            route: "/api/admin/notification/delete/:id",
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

module.exports = Ticket_conversationController;

    