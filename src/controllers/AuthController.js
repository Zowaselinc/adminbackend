
const {request} = require("express");
const jwt = require("jsonwebtoken");
const {Admin,  AccessToken, Activitylog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mailer = require("../services/mailer");

class AuthController{

    /* -------------------------- LOGIN ADMIN END POINT ------------------------- */

    static async login(req, res){
        const errors = validationResult(req);
        var admin = await Admin.findOne({where : { email : req.body.email }});

        try{


        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: true,
                message: "All fiedlds are required",
                data: {}
             });

        }

      
        if(admin){
            var passwordCheck = await bcrypt.compare(req.body.password, admin.password);

            if(passwordCheck){


                var token = jwt.sign(
                    {id: admin.id},
                    process.env.TOKEN_KEY,
                    {expiresIn : "48h"}
                )

                
                /* -------------------------- RECORD LOGIN ACTIVITY ------------------------- */
                var activlog = await Activitylog.create({
                    admin_id:admin['admin_id'],
                    section_accessed:'Dashboard Home',
                    page_route:'/api/admin/auth/login',
                    action:'Logged In'
                });

                /* ------------------------- SEND NOTIFICATION EMAIL ------------------------ */
            
                if(activlog){
                    await mailer().to(req.body.email).from(process.env.MAIL_FROM)
                    .subject('Login Notification').template("emails/LoginNotify").send();
                     admin['password']="";
                    return res.status(200).json({
                        error : false,
                        token : token,
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

    