const { request } = require("express");
const { validationResult } = require("express-validator");
const { Adminlog, ErrorLog } = require("~database/models");
const jwt = require("jsonwebtoken");


class AdminlogController{

    /* ------------------------ CREATE ADMINLOG END POINT ----------------------- */

    static async createAdminlog(req, res){
        try{
            const error = validationResult(req);
            if(!error.isEmpty()){
                return res.status(400).json({
                    errors:true,
                    message: "All fields are required",
                    data: {}
                    });
            }


            
            const adminid = crypto.randomBytes(16).toString("hex")
            var adminlog = await Adminlog.create({
                admin_id: "ZWLADM"+adminid,
                device_info:req.body.device_info,
                ip_address:req.body.ip_address,
                location:req.body.location
            });

                 /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Create Adminlogs',
              page_route:'/api/admin/adminlog/add',
              action:'Adding Adminlogs'
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

            if(adminlog){
                return res.status(200).json({
                    error:false,
                    message:"Adminlog created successfully"
                })
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create adminlog"
  
                 });
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Adminlogs",
                error_description: e.toString(),
                route: "/api/admin/adminlog/add",
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
/* ------------------------ GET ALL ADMINLOGS END POINT ------------------------ */
            static async getAllAdminlog(req, res){
                try{


                var adminlogs = await Adminlog.findAll();

                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'View all Adminlogs',
              page_route:'/api/admin/adminlog/getall',
              action:'Viewing all adminlogs'
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                    if(adminlogs){
                        return res.status(200).json({
                            error : false,
                            message: "Adminlog acquired successfully",
                            data : adminlogs
                        })
                    }else{
                        return res.status(200).json({
                            error : true,
                            message: "Failed to acquire adminlog",
                        })
                    }
            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Adminlogs",
                    error_description: e.toString(),
                    route: "/api/admin/adminlog/getall",
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

      /* --------------------------- GET ADMINLOG BY PARAMS -------------------------- */
      static async getadminlogbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var adminlogparams = await Adminlog.findAll({
            limit:limit,
            offset:offset
        });

              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
              var adminId = await  serveAdminid.getTheId(req);

              await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'View sets of adminlogs',
                page_route:'/api/admin/adminlog/getallparams',
                action:'View adminlogs by parameters'
            });
             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(adminlogparams){
            return res.status(200).json({
                error: false,
                message: 'Adminlog acquired successfully',
                data: adminlogparams
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Failed to acquire Adminlog',
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Adminlogs by params",
            error_description: e.toString(),
            route: "/api/admin/adminlog/getallparams/:offset/:limit",
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

    /* --------------------- GET ADMINLOG BY ID ENDPOINT --------------------- */
    static async getadminlogbyid(req,res){
        try{

        var adminlogid = await Adminlog.findOne({where: {id : req.params.id}});

              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
              var adminId = await  serveAdminid.getTheId(req);

              await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'View Adminlog',
                page_route:'/api/admin/adminlog/getbyid/:id',
                action:'Viewing an adminlog'
            });
             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(adminlogid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Adminlog acquired successfully',
                data: adminlogid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting adminlog by id",
            error_description: e.toString(),
            route: "/api/admin/adminlog/getbyid/:id",
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

    /* -------------------- GET ADMINLOG BY ADMIN ID ENDPOINT ------------------- */

    static async getadminlogbyAdminid(req,res){
        try{

        var adminlogid = await Adminlog.findOne({where: {admin_id : req.params.admin_id}});

          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'view Adminlogs',
            page_route:'/api/admin/adminlog/getbyadminid/;admin_id',
            action:'Viewing an Adminlog by its admmin id'
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(adminlogid.length<1){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Adminlog acquired successfully',
                data: adminlogid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting adminlog by admin_id",
            error_description: e.toString(),
            route: "/api/admin/adminlog/getbyid/:admin_id",
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

module.exports = AdminlogController;

    