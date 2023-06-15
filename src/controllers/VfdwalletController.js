const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Vfdwallet, ErrorLog, Activitylog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Mailer = require('~services/mailer');
const serveAdminid = require("~utilities/serveAdminId");
const md5 = require('md5');
const { EncryptConfig, DecryptConfig } = require("~utilities/encryption/encrypt");
const { mydb } = require("~utilities/backupdriver");
require('dotenv').config();
const axios = require('axios');


class VfdwalletController {

        static async createVfdaccount(req, res){
            const requestData = {

                firstname:req.body.firstname,
                lastname:req.body.lastname,
                middlename:req.body.middlename,
                dob:req.body.dob,
                address:req.body.address,
                gender:req.body.gender,
                phone:req.body.phone,
                bvn:req.body.bvn
            };
            // const c_key = `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`;
            // const base64Data = Buffer.from(c_key).toString('base64');
            // console.log(base64Data)

            const config = {
                headers: {
                  'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
                }
              };
            
      
            axios.post(process.env.BASE_URL+
                "/wallet2/clientdetails/create?wallet-credentials="+process.env.WALLET_CREDENTIALS, 
                requestData, config)
            .then(response => {
                

                const responseData = response.data;
                const data = responseData.data;
                const accountNum = data.accountNo;

                let vfdWallet = Vfdwallet.create({
                    user_id:req.body.userid,
                    account_number:accountNum
                });
                if(vfdWallet){
                    res.status(200).json({
                        error:false,
                        message: "Wallet created successfully",
                        data: {accountNo:accountNum}
                    })
                }else{
                    res.status(400).json({
                        error:true,
                        message:"Request failed"
                    })
                }

                
            })
            .catch(error => {
            // Handle any errors
                res.status(500).json({ error: 'An error occurred: ' + error});
            });
        }
        



    
        
    }


module.exports = VfdwalletController;