


const { request } = require("express");
const { validationResult } = require("express-validator");
const {AdminNotification, ErrorLog,Activitylog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class Ticket_conversationController{
/* ----------------------- CREATE/ADD ADMIN NOTIFICATION END POINT ----------------------- */
    static async createNotification(req, res){
        try{

             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
             var adminId = await  serveAdminid.getTheId(req);

             await Activitylog.create({
               admin_id:adminId ,
               section_accessed:'Create Notification',
               page_route:'/api/admin/notification/add',
               action:'Creating notification'
           });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
     
            const notificationid = crypto.randomBytes(16).toString("hex")
            var notification = await AdminNotification.create({
                notification_id:"ZWLNOTF"+notificationid,
                notification_title:req.body.notification_title,
                notify_description:req.body.notify_description,
                notification_type:req.body.notification_type,
                notification_status:req.body.notification_status,
                admin_id:req.body.admin_id
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

            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
             var adminId = await  serveAdminid.getTheId(req);

             await Activitylog.create({
               admin_id:adminId ,
               section_accessed:'View all notifications',
               page_route:'/api/admin/notification/getall',
               action:' viewing all notifications'
           });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

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

            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'View sets of notifications',
              page_route:'/api/admin/notification/getallparams',
              action:'viewing all notification by parameters'
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

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

            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'View notification by id',
              page_route:'/api/admin/notification/getbyid',
              action:'Viewing a particular notification'
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

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

            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit notification',
              page_route:'/api/admin/notification/edit',
              action:'Editing notification'
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        var editmessage = await Message.update({
           notification_status:req.body.notification_status
        }, { where : { id : req.body.id } });

        if(editmessage){
            return res.status(200).json({
                error : false,
                message : "Notification status edited succesfully",
            })
           
        }else{
            return res.status(200).json({
                error: true,
                message: "Failed to edit notification"
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

             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
             var adminId = await  serveAdminid.getTheId(req);

             await Activitylog.create({
               admin_id:adminId ,
               section_accessed:'Delete notifications',
               page_route:'/api/admin/notification/delete/:id',
               action:'Deleting notification'
           });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        var delnotification = await AdminNotification.destroy({ where : {id : req.params.id}});

        if(delnotification){
            return res.status(200).json({
                error : false,
                message : "Admin Notification deleted successfully",
            })
        }else{
           
            return res.send(200).json({
                error : true,
                message : "Failed to delete notification",
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

    