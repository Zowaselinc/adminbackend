
const {request} = require("express");
const jwt = require("jsonwebtoken");
const {Admin,  AccessToken, Activitylog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

class AuthController{

    /* -------------------------- LOGIN ADMIN END POINT ------------------------- */

    static async login(req, res){
        const errors = validationResult(req);
        try{


        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: true,
                message: "All fiedlds are required",
                data: {}
             });

        }

        var admin = await Admin.findOne({where : {email : req.body.email }});

        if(admin){
            var passwordCheck = await bcrypt.compare(req.body.password, admin.password);

            if(passwordCheck){


                var token = jwt.sign(
                    {id: admin.id},
                    process.env.TOKEN_KEY,
                    {expiresIn : "48h"}
                )

                delete admin['password'];
                /* -------------------------- RECORD LOGIN ACTIVITY ------------------------- */
                var activlog = await Activitylog.create({
                    admin_id:admin['admin_id'],
                    section_accessed:'Dashboard Home',
                    page_route:'/api/admin/auth/login',
                    action:'Logged In'
                });

                if(activlog){
                    return res.status(200).json({
                        error : false,
                        token : token,
                        keyid:data.admin_id,
                        message : "Logged in successfully",
                        data: admin
                    })
                }
               

            }else{
                return res.status(400).json({
                    error: true,
                    message : "Invalid credentials"
                })
            }

        }else{
            return res.status(400).json({
                error: true,
                message : "Admin not found"
            })
        }

    }catch(e){
        return res.status(500).json({
            message: e.toString()
        })
    }


    }



}
module.exports = AuthController;

    