
const {request} = require("express");
const jwt = require("jsonwebtoken");
const {Admin,  AccessToken, Activitylog,User, Company, Merchant, Partner, Corporate, Agent, UserCode, MerchantType, ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const md5  = require('md5');
require('dotenv').config();
const mailer = require("~services/mailer");
const serveAdminid = require("~utilities/serveAdminId");

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
                    
                    try {
                        mailer().to(req.body.email).from(process.env.MAIL_FROM)
                        .subject('Login Notification').template("emails/LoginNotify").send();
                         admin['password']="";
                       
                    } catch (error) {
                        
                    }
                   
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
        var logError = await ErrorLog.create({
            error_name: "Error on logging in Admin",
            error_description: e.toString(),
            route: "/api/admin/register",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+e.toString()
                
            })

        }

    }


    }


    /* ---------------------------- // register admin --------------------------- */

    static async registerAdmin(req, res){
        try{
            var adminId = await  serveAdminid.getTheId(req);

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

            var regadmin = await Admin.create({
                admin_id :"ZWLADM"+adminid,
                first_name : req.body.first_name,
                last_name : req.body.last_name,
                email : req.body.email,
                password : encrypted,
                phone : req.body.phone,
                role_id: req.body.role_id,
                role_name: req.body.role_name,
                recovery_phrase:recoveryPhrase
            });

        /* ---------------------------------- LOGIN ACTIVITY LOG --------------------------------- */
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'register new administrator',
                        page_route:'/api/admin/register',
                        action:'Registering new administrator'
                    });
        /* ---------------------------------- LOGIN ACTIVITY LOG --------------------------------- */

            if(regadmin){
                return res.status(200).json({
                    error : false,
                     message : "Admin register succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to register admin"
  
                 });

            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on registering new Admin",
                error_description: e.toString(),
                route: "/api/admin/register",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                    
                })

            }

        }
    }


    /* ------------------------------ register user ----------------------------- */



}
module.exports = AuthController;

    