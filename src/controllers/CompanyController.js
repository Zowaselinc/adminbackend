


const { request } = require("express");
const { Company, ErrorLog,Activitylog } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");


class ErrorlogController{

/* ------------------------ GET ALL COMPANY END POINT ------------------------ */
            static async getallCompanies(req, res){
                try{

                var allcompanies = await Company.findAll();

                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View all companies',
          page_route:'/api/admin/company/getall',
          action:'Viewing all companies in the list '
      });
       /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
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

          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View companies by offset and limit',
            page_route:'/api/admin/company/getallparams',
            action:'Viewing sets of companies in the list '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
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

          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View company by user id',
            page_route:'/api/admin/getbyuserid/:user_id',
            action:"Viewing a company's details"
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(companyid.lenght<1){
            return res.status(200).json({
                error: true,
                message: 'Invalid user id',
                
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Company fetched',
                data: companyid
                
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

          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View company by company email',
            page_route:'/api/admin/company/getbycompanyemail/:email',
            action:"Viewing a company's details"
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

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
            error_name: "Error on getting Company email",
            error_description: e.toString(),
            route: "/api/admin/company/getbyemail/:email",
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
    /* ------------------------ GET COMPANY by COMPANY email ----------------------- */
}

module.exports = ErrorlogController;

    