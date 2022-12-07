

const { request } = require("express");
const crypto = require('crypto');
const { validationResult } = require("express-validator");
const { Activitylog, ErrorLog } = require("~database/models");
const jwt = require("jsonwebtoken");


class AdminlogController{

    /* --------------------------- CREATE ACTIVITYLOG --------------------------- */
    static async createActivitylog(req, res){
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
            var activlog = await Activitylog.create({
                admin_id: "ZWLADM"+adminid,
                section_accessed:req.body.section_accessed,
                page_route:req.body.page_route,
                action:req.body.action
            });
            if(activlog){
                return res.status(200).json({
                    error:false,
                    message:"Activitylog created successfully"
                })
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create activitylog"
  
                 });
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Activitylogs",
                error_description: e.toString(),
                route: "/api/admin/activitylog/add",
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
/* ------------------------ GET ALL ACTIVITYLOGS END POINT ------------------------ */
            static async getAllActivitylogs(req, res){
                try{

                var activitylogs = await Activitylog.findAll();

                if(activitylogs){
                    return res.status(200).json({
                        error : false,
                        message: "Activitylogs acquired successfully",
                        data : activitylogs
                    });
                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Failed to acquire activitylog",
                        
                    })
                }
   
                

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Activitylogs",
                    error_description: e.toString(),
                    route: "/api/admin/activitylog/getall",
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

      /* --------------------------- GET ACTIVITYLOG BY PARAMS -------------------------- */
      static async getActivitylogbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var activitylogparams = await Activitylog.findAll({
            limit:limit,
            offset:offset
        });
        if(activitylogparams){
            return res.status(200).json({
                error: false,
                message: 'Activitylog acquired successfully',
                data: activitylogparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Activitylog',
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Activitylog by params",
            error_description: e.toString(),
            route: "/api/admin/activitylog/getallparams/:offset/:limit",
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

    /* --------------------- GET ACTIVITYLOG BY ID ENDPOINT --------------------- */
    static async getActivitylogbyid(req,res){
        try{

        var activitylogid = await Activitylog.findOne({where: {id : req.params.id}});
        if(activitylogid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Activitylog acquired successfully',
                data: activitylogid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Activitylog by id",
            error_description: e.toString(),
            route: "/api/admin/activitylog/getbyid/:id",
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

    /* --------------------- GET ACTIVITYLOG BY ADMIN ID ENDPOINT --------------------- */
    static async getActivitylogbyAdminid(req,res){
        try{

        var activitylogadminid = await Activitylog.findOne({where: {admin_id : req.params.admin_id}});
        if(activitylogadminid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Activitylog acquired successfully',
                data: activitylogadminid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Activitylog by  admin_id",
            error_description: e.toString(),
            route: "/api/admin/activitylog/getbyadminid/:admin_id",
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

    