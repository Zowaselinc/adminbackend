const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs

class AdminController{
/* ----------------------- CREATE/ADD ADMIN END POINT ----------------------- */
    static async createAdmin(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }


            var encrypted = await bcrypt.hash(req.body.password, 10);
            const adminid = crypto.randomBytes(16).toString("hex");
            const recoveryPhrase = crypto.randomBytes(16).toString("hex");

            var admin = await Admin.create({
                admin_id :"ZWLADM"+adminid,
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email : req.body.email,
                password : encrypted,
                phone : req.body.phone,
                role: req.body.role,
                recovery_phrase:recoveryPhrase
            });

            if(admin){
                return res.status(200).json({
                    error : false,
                     message : "Admin created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create admin"
  
                 });

            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Admin",
                error_description: e.toString(),
                route: "/api/admin/add",
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


/* ------------------------ GET ALL ADMINS END POINT ------------------------ */
            static async getAllAdmins(req, res){
                try{

                var admins = await Admin.findAll();
                if(admins){
                    return res.status(200).json({
                        error : false,
                        message: "Admin acquired successfully",
                        data : admins
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable fetch admin",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Admin",
                    error_description: e.toString(),
                    route: "/api/admin/getall",
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

      /* --------------------------- GET ADMIN BY PARAMS -------------------------- */
      static async getadminbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var adminparams = await Admin.findAll({
            limit:limit,
            offset:offset
        });
        if(adminparams){
            return res.status(200).json({
                error: false,
                message: 'Admin acquired successfully',
                data: adminparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Admin',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Admin by paprams",
            error_description: e.toString(),
            route: "/api/admin/getallparams/:offset/:limit",
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

    /* --------------------- GET ADMIN BY ADMIN ID ENDPOINT --------------------- */
    static async getadminbyid(req,res){
        try{

        var adminid = await Admin.findOne({where: {id : req.params.id}});
        if(adminid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Admin acquired successfully',
                data: adminid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Admin by id",
            error_description: e.toString(),
            route: "/api/admin/getbyid/:id",
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


    /* --------------------- GET ADMIN BY ADMIN ID ENDPOINT --------------------- */
    static async getadminbyadminid(req,res){
        try{

        var theadminid = await Admin.findOne({where: {admin_id : req.params.admin_id}});
        if(theadminid == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Admin acquired successfully',
                data: theadminid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Admin by adminid",
            error_description: e.toString(),
            route: "/api/admin/getbyadminid/:admin_id",
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


    /* -------------------- GET ADMIN BY ADMIN EMAIL ENDPOINT ------------------- */
    static async getbyemail(req,res){
        try{

       
        var adminemail = await Admin.findOne({where: {email : req.params.email}});
        if(adminemail == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Admin acquired successfully',
                data: adminemail
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Admin by email",
            error_description: e.toString(),
            route: "/api/admin/getbyemail/:email",
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
      

    /* ---------------------- EDIT ADMIN BY admin ID END POINT ---------------------- */
    static async editAdminbyadminid(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

        var editAdmin = await Admin.update({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            phone : req.body.phone,
            role: req.body.role,
        }, { where : { admin_id : req.body.admin_id } });

        if(editAdmin){
            return res.status(200).json({
                error : false,
                message : "Admin edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit admin",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting Admin by adminid",
            error_description: e.toString(),
            route: "/api/admin/editbyadminid/:admin_id",
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
    /* ---------------------- EDIT ADMIN BY ID END POINT ---------------------- */
    static async editAdminbyid(req, res){
        try{
            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

        var editAdmin = await Admin.update({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            phone : req.body.phone,
            role: req.body.role,
        }, { where : {id : req.body.id } });

        if(editAdmin){
            return res.status(200).json({
                error : false,
                message : "Admin edited succesfully",
                data : editAdmin
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Failed to edit admin",
                data : editAdmin
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting Admin by id",
            error_description: e.toString(),
            route: "/api/admin/edit/:id",
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

    /* ------------------------ DELETE ADMIN BY ADMIN ID ------------------------ */
    static async deleteAdminbyadminid(req, res){
        try{

        var delAdminid = await Admin.destroy({ where : {admin_id : req.params.admin_id}});

        if(delAdminid){
            return res.status(200).json({
                error : false,
                message : "Admin deleted succesfully",
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete Admin",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Admin by admin_id",
            error_description: e.toString(),
            route: "/api/admin/deletebyadminid/:admin_id",
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
    /* --------------------------- DELETE ADMIN BY ID --------------------------- */
    static async deleteAdminbyid(req, res){
        try{

        var delAdminid = await Admin.destroy({ where : {id : req.params.id}});

        if(delAdminid == null){
            return res.status(200).json({
                error : true,
                message : "Not found",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Admin deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Admin by id",
            error_description: e.toString(),
            route: "/api/admin/delete/:id",
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

module.exports = AdminController;

    