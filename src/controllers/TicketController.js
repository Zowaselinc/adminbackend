
const { request } = require("express");
const { validationResult } = require("express-validator");
const {Ticket, ErrorLog, Activitylog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class TicketController{
/* ----------------------- CREATE/ADD TICKET END POINT ----------------------- */
    static async createTicket(req, res){
        try{

          const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }
            
            const ticketid = crypto.randomBytes(16).toString("hex");

            var ticket = await Ticket.create({
                ticket_id :"ZWLTKT"+ticketid,
                user_id :req.body.user_id,
                subject:req.body.subject,
                description:req.body.description,
                priority:req.body.priority,
                admin_assigned:req.body.admin_assigned,
                ticket_status:req.body.ticket_status,
               
            });

             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Create Ticket',
            page_route:'/api/admin/ticket/add',
            action:'Created ticket '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(ticket){
                return res.status(200).json({
                    error : false,
                     message : "Tickets created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create Ticket"
  
                 });

            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Ticket",
                error_description: e.toString(),
                route: "/api/admin/ticket/add",
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
    /* ------------------------------TOTAL ACTIVE TICKETS-------------------------------------------- */
        static async ticketStatus(req, res){
            var ticketStatus = await Ticket.findAll({where:{ticket_status:'1'}});
            if(ticketStatus<0){
                return res.status(200).json({
                    error:true,
                    message:"active status not found"
                })
            }else{
                return res.status(200).json({
                    error:false,
                    message:"Total status found",
                    data:[{"Non-ActiveTicket":ticketStatus.length}]
                })
            }
        }
  /* ------------------------------------ TOTAL ACTIVE TICKETS --------------------------------------------- */

/* ------------------------ GET ALL TICKETS END POINT ------------------------ */
            static async getAllTickets(req, res){
                try{

                var alltickets = await Ticket.findAll();

                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View all tickets',
            page_route:'/api/admin/ticket/getall',
            action:'Viewing all tickets in the list '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                if(alltickets){
                    return res.status(200).json({
                        error : false,
                        message: "Tickets acquired successfully",
                        data : alltickets
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable acquire Tickets",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Tickets",
                    error_description: e.toString(),
                    route: "/api/admin/ticket/getall",
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

      /* --------------------------- GET TICKET BY PARAMS -------------------------- */
      static async getTicketsbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var ticketparams = await Ticket.findAll({
            limit:limit,
            offset:offset
        });

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'View ticket by offset and limit',
             page_route:'/api/admin/ticket/getallparams/;offset/:limit',
             action:'Viewing sets of tickets in the list'
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(ticketparams){
            return res.status(200).json({
                error: false,
                message: 'Tickets acquired successfully',
                data: ticketparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Ticket',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Tickets by paprams",
            error_description: e.toString(),
            route: "/api/admin/ticket/getallparams/:offset/:limit",
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

    /* --------------------- GET TICKET BY  ID ENDPOINT --------------------- */
    static async getTicketbyid(req,res){
        try{

        var ticketid = await Ticket.findOne({where: {id : req.params.id}});

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'View ticket by id',
             page_route:'/api/admin/ticket/getbyid/:id',
             action:'Viewing ticket'
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(ticketid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Ticket acquired successfully',
                data: ticketid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Ticket by id",
            error_description: e.toString(),
            route: "/api/admin/ticket/getbyticketid/:id",
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


    /* --------------------- GET TICKET BY TICKET ID ENDPOINT --------------------- */
    static async getbyTicketid(req,res){
        try{

        var ticketid = await Ticket.findOne({where: {ticket_id : req.params.ticket_id}});

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'View ticket by ticket id',
             page_route:'/api/admin/ticket/getbyticketid/:ticket_id',
             action:'Viewing ticket '
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(ticketid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Ticket acquired successfully',
                data: ticketid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Ticket by id",
            error_description: e.toString(),
            route: "/api/admin/ticket/getbyticketid/:ticket_id",
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


    /* -------------------- GET TICKET BY USER ID ENDPOINT ------------------- */
    static async getticketbyuserid(req,res){
        try{

       
        var tickuserid = await Ticket.findOne({where: {user_id: req.params.user_id}});

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'View ticket by user id',
             page_route:'/api/admin/ticket/getbyuserid/:user_id',
             action:'Viewing ticket '
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(tickuserid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Tickets acquired successfully',
                data: tickuserid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Ticket by by user_id",
            error_description: e.toString(),
            route: "/api/admin/ticket/getbyuserid/:user_id",
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
      

    /* ---------------------- EDIT TICKET BY ID END POINT ---------------------- */
    static async editTicket(req, res){
        try{

        var editTicket = await Ticket.update({
           ticket_status:req.body.ticket_status
        }, { where : { id : req.body.id } });

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'Edit ticket status',
             page_route:'/api/admin/ticket/edit',
             action:'Editted ticket status'
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(editTicket){
            return res.status(200).json({
                error: false,
                message: "Ticket Status edited succesfully" 
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit ticket status",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting Ticket status",
            error_description: e.toString(),
            route: "/api/admin/ticket/edit",
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

    /* ------------------------ DELETE TICKET BY ID ------------------------ */
    static async deleteTicket(req, res){
        try{

        var delticket = await Ticket.destroy({ where : {id : req.params.id}});

           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
           var adminId = await  serveAdminid.getTheId(req);

           await Activitylog.create({
             admin_id:adminId ,
             section_accessed:'Delete ticket',
             page_route:'/api/admin/ticket/delete/:id',
             action:'deleted ticket '
         });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(delticket){
            return res.status(200).json({
                error : false,
                message : "Ticket deleted successfully",
            })
        }else{
            return res.status(200).json({
                error :true,
                message : "Failed to delete Ticket",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Ticket",
            error_description: e.toString(),
            route: "/api/admin/ticket/delete/:id",
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

module.exports = TicketController;

    