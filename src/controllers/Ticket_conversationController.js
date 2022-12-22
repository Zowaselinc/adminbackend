


const { request } = require("express");
const { validationResult } = require("express-validator");
const {TicketConversation, ErrorLog, Activitylog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class Ticket_conversationController{
/* ----------------------- CREATE/ADD TICKET CONVERSATION END POINT ----------------------- */
    static async createTconvtn(req, res){
        try{
            // INSERT INFORMATION INTO TicketConversation TABLE 
            var conversation = await TicketConversation.create({
                ticket_id:req.bopdy.ticket_id,
                conversation_id:req.body.conversation_id,
                sender_id:req.body.sender_id,
                message:req.body.message,
                message_type:req.body.message_type,
            });

               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'create ticket conversation',
            page_route:'/api/admin/ticketcovtn/add',
            action:'Created ticket conversation '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(conversation){
                return res.status(200).json({
                    error : false,
                     message : "Ticket Conversation created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create Ticket Conversation"
  
                 });

            }
            /* -------------------------------- ERRORLOGS ------------------------------- */
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Ticket Conversation",
                error_description: e.toString(),
                route: "/api/admin/ticketcovtn/add",
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
    /* ----------------------------ERRORLOGS---------------------------------------------- */


/* ------------------------ GET ALL TICKET CONVERSATION END POINT ------------------------ */
            static async getAllTconvtn(req, res){
                try{

                var allconversation = await TicketConversation.findAll();

    /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View all ticket conversation',
            page_route:'/api/admin/ticketcovtn/getall',
            action:'Viewing all ticket conversations in the list '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                if(allconversation){
                    return res.status(200).json({
                        error : false,
                        message: "Ticket Conversation acquired successfully",
                        data : allconversation
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to acquire Ticket Conversation",
                    });

                }
                            // ERRORLOGS
            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Ticket Conversation",
                    error_description: e.toString(),
                    route: "/api/admin/ticketcovtn/getall",
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

      /* --------------------------- GET TICKET CONVERSATION BY PARAMS -------------------------- */
      static async getTconvtnbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var conversationparams = await TicketConversation.findAll({
            limit:limit,
            offset:offset
        });

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'View ticket conversation by offset and limit',
           page_route:'/api/admin/ticketcovtn/getallparams/:offset/:limit',
           action:'viewed ticket conversation '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(conversationparams){
            return res.status(200).json({
                error: false,
                message: 'Ticket Conversation acquired successfully',
                data: conversationparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Ticket Conversation',
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Ticket Conversation by paprams",
            error_description: e.toString(),
            route: "/api/admin/ticketcovtn/getallparams/:offset/:limit",
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

    /* --------------------- GET GET TICKET CONVERSATION BY  ID ENDPOINT --------------------- */
    static async getTconvtnbyid(req,res){
        try{

        var conversationid = await TicketConversation.findOne({where: {id : req.params.id}});

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'View ticket conversation by id',
           page_route:'/api/admin/ticketcovtn/getbyid/:id',
           action:'Viewed ticket conversation'
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(conversationid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Ticket Conversation acquired successfully',
                data: conversationid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Ticket Conversation by id",
            error_description: e.toString(),
            route: "/api/admin/ticketcovtn/getbyid/:id",
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

    /* ------------------------ DELETE GET TICKET CONVERSATION BY ID ------------------------ */
    static async deleteTconvtn(req, res){
        try{

        var delconversation = await TicketConversation.destroy({ where : {id : req.params.id}});

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Delete ticket conversation',
           page_route:'/api/admin/ticketcovtn/delete/:id',
           action:'Deleted ticket conversation '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(delconversation == null){
            return res.send(200).json({
                error : true,
                message : "Not found",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Ticket Conversation deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Ticket Conversation",
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

module.exports = Ticket_conversationController;

    