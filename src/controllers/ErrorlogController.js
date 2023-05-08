
const { request } = require("express");
const {  ErrorLog } = require("~database/models");
const jwt = require("jsonwebtoken");

class ErrorlogController{

/* ------------------------ GET ALL ERRORLOGS END POINT ------------------------ */
            static async getallErrologs(req, res){
                try{

                var allerrors = await ErrorLog.findAll();
                if(allerrors){
                    return res.status(200).json({
                        error : false,
                        message: "Errorlog fetched",
                        data : allerrors
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Failed to fetch errorlog",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all errorlogs",
                    error_description: e.toString(),
                    route: "/api/admin/errorlo/getall",
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

      /* --------------------------- GET ERRORLOG BY PARAMS -------------------------- */
      static async geterrologsbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
        var errorlogparams = await ErrorLog.findAll({
            limit:limit,
            offset:offset
        });
        if(errorlogparams){
            return res.status(200).json({
                error: false,
                message: 'Errorlog Fetched successfully',
                data: errorlogparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch errorlog',
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Errorlog by paprams",
            error_description: e.toString(),
            route: "/api/admin/errorlog/getallparams/:offset/:limit",
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

    /* --------------------- GET ERRORLOG by id ENDPOINT --------------------- */
    static async getErrorlogbyid(req,res){
        try{

        var errorlogid = await ErrorLog.findOne({where: {id : req.params.id}});
        if(errorlogid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Errorlog acquired successfully',
                data: errorlogid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Errorlog by id",
            error_description: e.toString(),
            route: "/api/admin/errorlog/getbyid/:id",
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

    /* --------------------------- DELETE ERRORLOG BY ID --------------------------- */
    static async deleteErrorlogbyid(req, res){
        try{

        var delerrorlog = await ErrorLog.destroy({ where : {id : req.params.id}});

        if(delerrorlog){
            return res.status(200).json({
                error : false,
                message : "Errorlog deleted successfully",
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete errorlog",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting errorlog by id",
            error_description: e.toString(),
            route: "/api/admin/errorlog/delete/:id",
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

module.exports = ErrorlogController;

    