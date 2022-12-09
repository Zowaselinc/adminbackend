


const { request } = require("express");
const { Company, ErrorLog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");


class ErrorlogController{

/* ------------------------ GET ALL COMPANY END POINT ------------------------ */
            static async getallCompanies(req, res){
                try{

                var allcompanies = await Company.findAll();
                if(allcompanies){
                    return res.status(200).json({
                        error : false,
                        message: "All Companies fetched successfully",
                        data : allcompanies
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Failed to fetched companies",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all errorlogs",
                    error_description: e.toString(),
                    route: "/api/admin/company/getall",
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

      /* --------------------------- GET COMPANY BY PARAMS -------------------------- */
      static async getcompaniesbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
        var companyparams = await Company.findAll({
            limit:limit,
            offset:offset
        });
        if(companyparams){
            return res.status(200).json({
                error: false,
                message: 'company Fetched successfully',
                data: companyparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch company',
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all companies by paprams",
            error_description: e.toString(),
            route: "/api/admin/comapny/getallparams/:offset/:limit",
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

    /* --------------------- GET COMPANY USER ID ENDPOINT --------------------- */
    static async getcompanybyuserid(req,res){
        try{
            
        var companyid = await Company.findOne({where: {user_id:req.params.user_id}});

        if(companyid){
            return res.status(200).json({
                error: false,
                message: 'Company fetched successfully',
                data: companyid
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch company',
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Company by id",
            error_description: e.toString(),
            route: "/api/admin/company/getbyuserid/:user_id",
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

    /* --------------------- GET COMPANY by company email ENDPOINT --------------------- */
    static async getcompanybyCompanyemail(req,res){
        try{


        var comapanyEmail = await Company.findOne({where: {company_email:req.params.company_email}});

        if(comapanyEmail){
            return res.status(200).json({
                error:false,
                message: 'Company fetched successfully',
                data: comapanyEmail
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to fetch company',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Company by id",
            error_description: e.toString(),
            route: "/api/admin/company/getbyemail/:company_id",
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
    /* ------------------------ GET COMPANY COMPANY email ----------------------- */
}

module.exports = ErrorlogController;

    