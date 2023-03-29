const { request } = require("express");
const { validationResult } = require("express-validator");
const {  ErrorLog, Kycdocs, User , } = require("~database/models");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { kycDocs } = require("~routes/validators/AccountValidator");


class KycDocsController{

    static async updateKycDocs(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }


            const uploadkycDocs = await  Kycdocs.create({
                user_id:req.body.user_id,
                id_type: req.body.id_type,
                id_front: req.body.id_front,
                id_back:req.body.id_back,
                id_number: req.body.id_number
            });

            if(uploadkycDocs){
                return res.status(200).json({
                    error:false,
                    message: "User's kyc docs updated "
                })
            }else{
                return res.status(200).json({
                    error:true,
                    message: "failed to update user's kyc docs"
                })
            }

        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error updating usre's document",
                error_description: err.toString(),
                route: "/api/admin/user/account/verifykycdocs",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment' + " " + err.toString(),
                    
                })

            }
        }

        }

        /* ------------------------ get all verified kyc docs ----------------------- */

        static async getAllkycdocs(req, res){
            
            try{

            var allDocs = await Kycdocs.findAll();
            
            if(allDocs){
                return res.status(200).json({
                    error : false,
                    message: "Kyc docs acquired successfully",
                    data : allDocs
                });

            }else{
                return res.status(200).json({
                    error : true,
                    message: "Unable to fetch kyc docs",
                });

        }

        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all kyc docs",
                error_description: err.toString(),
                route: "/api/admin/users/account/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment' + err.toString(),
                    
            })

                }
            }
        }

            /* --------------------- get verified user docs by id  --------------------- */
                static async getkycdocsbyid(req,res){
                try{
                
                var getDocsbyid = await Kycdocs.findOne({where: {id : req.params.id}});
                    var user = getDocsbyid.dataValues.user_id;
                    var getUser = await User.findOne({where:{id:user}});
                    delete getUser.dataValues.created_at;
                    delete getUser.dataValues.updated_at;


                    var theuser= getDocsbyid.dataValues;
                    theuser.user= getUser.dataValues;

                if(getDocsbyid){
                    return res.status(200).json({
                        error: false,
                        message: 'Kyc docs acquired successfully',
                        data: theuser
                       
                    })
                }else{
                    return res.status(200).json({
                        error:true,
                        message: 'Failed to acquire kyc docs'
                        
                    })
                }
            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting kyc docs by id",
                    error_description: err.toString(),
                    route: "/api/admin/user/account/getbyid/:id",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment' + err.toString(),
                        
                    })

                }
            }
            }


            /* --------------------- get verified kyc docs by user_id --------------------- */
            static async getkycdocsbyUserid(req,res){
                try{
                
                var getbyUserid = await Kycdocs.findOne({where: {user_id : req.params.user_id}});
                var user = getbyUserid.dataValues.user_id;
                var getUser = await User.findOne({where:{id:user}})
                delete getUser.dataValues.created_at;
                delete getUser.dataValues.updated_at;
               

                var theuserid= getbyUserid.dataValues;
                theuserid.user= getUser.dataValues;

                if(getbyUserid == null){
                    return res.status(200).json({
                        error:true,
                        message: 'invalid  id'
                    })
                }else{
                    return res.status(200).json({
                        error: false,
                        message: 'Kyc docs acquired successfully',
                        data: theuserid
                        
                    })
                }
            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting kyc docs by user id",
                    error_description: err.toString(),
                    route: "/api/admin/user/account/getbyid/:user_id",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment' + err.toString(),
                        
                    })

                }
            }
            }

            /* --------------------- get verified kyc docs by id_number --------------------- */
            static async getByidnumber(req,res){
                try{
                
                var getbyIdNumber = await Kycdocs.findOne({where: {id_number : req.params.id_number}});
                var user = getbyIdNumber.dataValues.user_id;
                var getUser = await User.findOne({where:{id:user}});
                delete getUser.dataValues.created_at;
                delete getUser.dataValues.updated_at;
               

                var userid= getbyIdNumber.dataValues;
                userid.user= getUser.dataValues;

                if(getbyIdNumber == null){
                    return res.status(200).json({
                        error:true,
                        message: 'invalid  id'
                    })
                }else{
                    return res.status(200).json({
                        error: false,
                        message: 'Kyc docs acquired successfully',
                        data: userid
                        
                    })
                }
            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting kyc docs by id number",
                    error_description: err.toString(),
                    route: "/api/admin/user/account/getbyidnumber/:id_number",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment' + err.toString(),
                        
                    })

                }
            }
            }

            /* ---------------------- edith kyc docs ---------------------- */
    static async editKyycDocs(req, res){
        try{


        var editKycdocs = await Kycdocs.update({
                user_id:req.body.user_id,
                id_type: req.body.id_type,
                id_front: req.body.id_front,
                id_back:req.body.id_back,
                id_number: req.body.id_number
        }, { where : { id : req.body.id } });

        if(editKycdocs){
            return res.status(200).json({
                error : false,
                message : "kyc docs edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit kyc docs",
            })
        }
       
        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error on editting kyc docs",
                error_description: err.toString(),
                route: "/api/admin/users/account/edit",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment' + err.tostring(),
                    
                })

            }
        }
        }

        /* ------------------------ DELETE kyc docs ------------------------ */
    static async deletekycdocs(req, res){
        try{

       var delKycdocs = await Kycdocs.destroy({ where : {id : req.params.id}});

        if(delKycdocs){
            return res.status(200).json({
                error : false,
                message : "Kyc doc deleted succesfully",
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete Kyc doc",
            })
        }

    }catch(err){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting kyc doc",
            error_description: err.toString(),
            route: "/api/admin/user/account/delete/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment' + err.toString(),
            })

        }
    }
    }

}

module.exports = KycDocsController;

    