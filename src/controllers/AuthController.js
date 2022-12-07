
const {request} = require("express");
const jwt = require("jsonwebtoken");
const {Admin,  AccessToken } = require("~database/models");
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
                return res.status(200).json({
                    error : false,
                    token : token,
                    message : "Logged in successfully"
                })

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

    