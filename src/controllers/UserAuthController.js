const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User, Company, AccessToken, Merchant, Partner, Corporate, Agent, UserCode, MerchantType, Wallet, ErrorLog, Kycdocs, KYC, KYB, Activitylog, Vfdwallet } = require("~database/models");
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


class UserAuthController {

    /* -------------------------------------------------------------------------- */
    /*                                    login                                   */
    /* -------------------------------------------------------------------------- */


    static async loginUser(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        let user = await User.findOne({ where: { email: data.email } });

        if (!user) {
            return res.status(200).json({
                error: true,
                message: "Invalid credentials"
            });
        }

        var userTypeMap = {
            merchant: Merchant,
            partner: Partner,
            agent: Agent,
            corporate: Corporate
        };

        let userType = await userTypeMap[user.type].findOne({
            where: { user_id: user.id },
            include: [
                {
                    model: User, as: "user", include: [
                        { model: Company, as: "company" }
                    ]
                }
            ]
        });

        let passwordCheck = await bcrypt.compare(data.password, user.password)

        if (passwordCheck) {
            const token = jwt.sign(
                { user_id: user.id, agent: req.headers['user-agent'] },
                process.env.TOKEN_KEY,
                { expiresIn: "5d" }
            );
            await UserAuthController.saveToken(user, token, req);
            //  userType.user.password;
            const ipAddresses = req.header('x-forwarded-for');
            let ipAddress = typeof ipAddresses == 'object' ? ipAddresses[0] : ipAddresses;
            Mailer()
                .to(user.email).from(process.env.MAIL_FROM)
                .subject('New Login').template('emails.LoginNotification', {
                    ipaddress: ipAddress,
                    timestamp: (new Date()).toLocaleString(),
                    name: user.first_name + " " + user.last_name,
                }).send();
            return res.status(200).json({
                error: false,
                message: "Login Successful",
                token: token,
                user: userType
            });
        } else {
            return res.status(200).json({
                error: true,
                message: "Invalid credentials"
            });
        }



    }

    /* -------------------------------------------------------------------------- */
    /*                              register marchant                             */
    /* -------------------------------------------------------------------------- */

    static async proceedWithRegistration(req, res) {
        const data = req.body;
                    let user = await UserAuthController.saveUser(data);
                    console.log("log");
            
                    if (user.error) {
                        console.log(user)
                        return res.status(400).json({
                            error: true,
                            message: user.message
                        });
                    }
            
                    if (data.has_company) {
                        var response = await UserAuthController.saveCompany(user, data);
                        if (response.error) {
                            
                            return res.status(400).json({
                                error: true,
                                message: response.message
                            });
                        }
                    }
            
                    var UserTypeModel = data.user_type == "merchant" ? Merchant : Corporate;
                
                    let change;
                    if (data.user_type == "merchant") {
                    
                        var merchantType = await MerchantType.findOne({ where: { title: 'grower' } });
                        if (merchantType) {
                            change = { type_id: merchantType.id };
                        }
                    } else {
                        change = { type: "red-hot" };
                        
                    }
            
                    await UserTypeModel.create({ ...change, ...{ user_id: user.id } }).catch((error => {
                        return res.status(400).json({
                            error: true,
                            message: error.sqlMessage
                        });
                    }));
            
                    return res.status(200).json({
                        error: false,
                        status: true,
                        user: user
                    });
    }

    static async registerMerchantCorporate(req, res) {
        try{
            let verifyKyc = 0, proceedwithnokyc = 0;
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            /* ---------- check if user exists before even proceeding with kyc ---------- */
            var checkUser = await User.findAll({
                where: { 
                    [Op.or]: [
                        { email: req.body.email }, 
                        { phone: req.body.phone }
                    ]
                }
            })
            
            if(checkUser.length > 0){
                return res.status(400).json({
                    error: true,
                    message: "User with this email or phone number already exist"
                })
            } else {
                /* --------------------- verify kyc at this point first --------------------- */
                if (req.body.runkyc == 1) {
                    proceedwithnokyc = 0;
                    let authkey;
                    
                    axios.post("https://api.qoreid.com/token", {
                        "clientId": "MPLJJO6C6HC905MIKY92",
                        "secret": "fe14fe9bc71349f884581f73df7d8aa4"
                    })
                    .then(response => {
                        
                        authkey = response.data.accessToken;
                        // console.log(response)
                            const config = {
                                headers: {
                                  'Authorization': `Bearer ${authkey}`,
                                }
                            };
                            let requestData;
                            let kyc_base_url;
                            if(req.body.id_type == "identity_card"){
                                kyc_base_url = `https://api.qoreid.com/v1/ng/identities/virtual-nin/${req.body.id_number}`;
                                requestData = {
                                    firstname: req.body.first_name,
                                    lastname: req.body.last_name,
                                    phone: req.body.phone,
                                    dob: "2022-10-10",
                                    email: req.body.email,
                                    gender: req.body.gender
                                };
                            } else if (req.body.id_type == "voter_card"){
                                kyc_base_url = `https://api.qoreid.com/v1/ng/identities/vin/${req.body.id_number}`;
                                requestData = {
                                    firstname: req.body.first_name,
                                    lastname: req.body.last_name,
                                    dob: "2022-10-10",
                                };
                            } else if (req.body.id_type == "driving_licence"){
                                kyc_base_url = `https://api.qoreid.com/v1/ng/identities/drivers-license/${req.body.id_number}`;
                                requestData = {
                                    firstname: req.body.first_name,
                                    lastname: req.body.last_name
                                };
                            } else if (req.body.id_type == "passport"){
                                kyc_base_url = `https://api.qoreid.com/v1/ng/identities/passport/${req.body.id_number}`;
                                requestData = {
                                    firstname: req.body.first_name,
                                    lastname: req.body.last_name,
                                    dob: "2022-10-10",
                                    gender: req.body.gender
                                };
                            }
            
                            axios.post(kyc_base_url, requestData, config)
                            .then(response => {
    
                                let matchData;
                                if(req.body.id_type == "identity_card"){
                                    matchData = response.data.summary.v_nin_check.status;
                                } else if (req.body.id_type == "voter_card"){
                                    matchData = response.data.summary.voters_card_check.status;
                                } else if (req.body.id_type == "driving_licence"){
                                    matchData = response.data.summary.drivers_license_check.status;
                                } else if (req.body.id_type == "passport"){
                                    matchData = response.data.summary.passport_ng_check.status;
                                }
                                if(matchData != "NO_MATCH") {
                                    UserAuthController.proceedWithRegistration(req, res);
                                } else {
                                    return res.status(400).json({
                                        error: true,
                                        message: "KYC Verification failed",
                                        data: response.data
                                    });
                                }
                                
                            })
                            .catch(error => {
                                if(Object.keys(error).length > 0){
                                    let axiosError = error.response.data;
                                    if(axiosError.statusCode == 400){
                                        res.status(400).json({
                                            error:true,
                                            message: axiosError.message
                                        })
                                        return false;
                                    } else {
                                        res.status(400).json({error: true, message: "Invalid ID Supplied", data: error})
                                    }
                                }
                            })
    
                        
                    })
    
    
                } else {
                    UserAuthController.proceedWithRegistration(req, res);
                }
            }
            
            // if(verifyKyc != undefined && proceedwithnokyc == 0){
            //     if(verifyKyc == 1){
                    
            //     } else {
            //         return res.status(200).json({
            //             error: true,
            //             message: "KYC Verification failed "+verifyKyc
            //         });
            //     }
            // }

        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error on registering new user",
                error_description: err.toString(),
                route: "/api/admin/users/register",
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

    /* ----------------------------- REGISTER AGENT ----------------------------- */
    static async registerAgent(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        let user = await UserAuthController.saveUser(data);

        if (user.error) {
            return res.status(400).json({
                error: true,
                message: user.message
            });
        }

        var save = await UserAuthController.saveCompany(user, data);
        if (save.error) {
            // await user.delete();
            return res.status(400).json({
                error: true,
                message: save.message
            });
        }

        await Agent.create({
            user_id: user.id,
            agent_type: data.agent_type
        }).catch((error) => {
            return res.status(400).json({
                error: true,
                message: error.sqlMessage
            });
        });

        Mailer()
            .to(data.email).from(process.env.MAIL_FROM)
            .subject('Welcome').template('emails.WelcomeEmail').send();


        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            { expiresIn: "48h" }
        );

        await UserAuthController.saveToken(user, token, req);

        res.status(200).json({
            status: true,
            token: token,
            user: user
        });
        

    }
    



    /* -------------------------------------------------------------------------- */
    /*                              register partner                              */
    /* -------------------------------------------------------------------------- */

    static async registerPartner(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        let user = await UserAuthController.saveUser(data);

        if (user.error) {
            return res.status(400).json({
                error: true,
                message: user.message
            });
        }

        var save = await UserAuthController.saveCompany(user, data);
        if (save.error) {
            // await user.delete();
            return res.status(400).json({
                error: true,
                message: save.message
            });
        }

        await Partner.create({
            user_id: user.id,
            partnership_type: data.partnership_type
        }).catch((error => {
            return res.status(400).json({
                error: true,
                message: error.sqlMessage
            });
        }));;

        Mailer()
            .to(data.email).from(process.env.MAIL_FROM)
            .subject('Welcome').template('emails.WelcomeEmail').send();

        const token = jwt.sign(
            { user_id: user.id },
            process.env.TOKEN_KEY,
            { expiresIn: "48h" }
        );

        await UserAuthController.saveToken(user, token, req);

        return res.status(200).json({
            status: true,
            token: token,
            user: user
        });

    }

/* ------------------------------ register user ----------------------------- */
    static async saveUser(data,res) {
        var user, userKycdocs, kycVerification;
        let encryptedPassword = await bcrypt.hash(data.password, 10);

        try {
            // const checkUser = await User.findOne({where:{
            //     [Op.or]: [
            //         {email: data.email},
            //         {phone: data.phone}
            //     ],
            // }});

            user = await User.create({
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                email: data.email,
                is_verified: 0,
                status: 1,
                password: encryptedPassword,
                type: data.user_type,
                dob: data.dateofbirth,
                gender: data.gender,
                // account_type: "individual",
                account_type: data.has_company || data.company_email ? "company" : "individual",
                
            });

            if(user){
                
                const applicantId = crypto.randomBytes(16).toString("hex");
                let checkeId = crypto.randomUUID();

                kycVerification = await KYC.create({
                    user_id: user.id,
                    applicant_id: applicantId,
                    check_id: checkeId,
                    status: "complete",
                    id_type: data.id_type,
                    id_number: data.id_number,
                    files: JSON.stringify({front: data.id_front, back: data.id_back}),
                    bvn:  EncryptConfig(data.bvn),
                    verified: 1

                });

                const requestData = {
                    
                    first_name:data.first_name,
                    last_name:data.last_name,
                    middlename:"",
                    dob:"",
                    address:"",
                    gender:"",
                    phone:data.phone,
                    bvn:data.bvn
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
                        user_id:user.id,
                        account_number:accountNum
                    });
                    
                })

            }
            // Create user wallet
            let wallet = await Wallet.create({
                user_id: user.id,
                balance: 0
            });

        } catch (err) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating user",
                error_description: err.toString(), 
                route: "/api/admin/user/account/add",
                error_code: "500"
            });
            if(logError){
                return {
                    error: true,
                    message: 'Unable to complete request at the moment' + " " + err.toString(),
                    
                }

            }
          
            user = {
                error: true,
                message: e.toString()
            }
        }

        return user;
    }




    /* --------------------------- // register company -------------------------- */
    static async saveCompany(user, data) {
        let company, userKyb;

        try {
            // company registration 
            company = await Company.create({
                user_id: user.id,
                company_name: data.company_name,
                company_address: data.company_address,
                company_phone: data.company_phone,
                company_email: data.company_email,
                state: data.company_state,
                country: data.company_country,
                contact_person: data.contact_person,
                rc_number: data.rc_number,
                company_website: data.company_website
            });
                // kyb verification 
                let checkeId = crypto.randomUUID();
                userKyb = await KYB.create({
                    user_id:user.id,
                    tax_id: data.tax_id,
                    cac: data.cac,
                    financial_statement: data.financial_statement,
                    mou: data.mou,
                    check_id: checkeId,
                    status: "pending"
                });
            
        } catch (err) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating user",
                error_description: err.toString(),
                route: "/api/admin/user/account/add",
                error_code: "500"
            });
            if(logError){
                return {
                    error: true,
                    message: 'Unable to complete request at the moment' + " " + err.toString(),
                    
                }

            }
        }

        return company;
    }

    static async saveToken(user, token, req) {

        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 2);

        var previousToken = await AccessToken.findOne({
            where: {
                user_id: user.id,
                client_id: req.headers['user-agent']
            }
        });

        if (previousToken) {
            await AccessToken.update({
                token: token,
                expires_at: expiry.toISOString().slice(0, 19).replace('T', ' ')
            }, { where: { user_id: user.id, client_id: req.headers['user-agent'] } });
        } else {
            await AccessToken.create({
                user_id: user.id,
                client_id: req.headers['user-agent'],
                token: token,
                expires_at: expiry.toISOString().slice(0, 19).replace('T', ' ')
            });
        }
    }

    static async sendVerificationCode(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }

        var code = getRandomInt(100000, 999999);

        //Check for exixting
        var formerCode = await UserCode.findOne({ where: { email: data.email, type: "verification" } })

        if (!formerCode) {
            UserCode.create({
                email: data.email,
                type: "verification",
                code: code
            }).catch(error => {
                console.log(error.sqlMessage)
            });
        } else {
            UserCode.update({
                code: code,
            }, {
                where: { email: data.email, type: "verification" }
            }).catch(error => {
                console.log(error.sqlMessage)
            });
        }




        Mailer()
            .to(data.email).from(process.env.MAIL_FROM)
            .subject('Verify').template('emails.OTPEmail', { code: code }).send();


        return res.status(200).json({
            status: true,
            message: "Code sent successfully"
        });

    }

    static async verifyCode(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var userCode = await UserCode.findOne({ where: { email: data.email, type: "verification" } });

        if (userCode.code == data.code) {
            return res.status(200).json({
                status: true,
                message: "Code verified successfully"
            });
        } else {
            return res.status(200).json({
                error: true,
                message: "Invalid code"
            });
        }



    }

    static async sendResetEmail(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var refererUrl = req.headers.referer;

        const data = req.body;

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
        }

        var code = getRandomInt(10000000, 99999999);

        var user = await User.findOne({ where: { email: data.email } });

        if (!user) {
            return res.status(400).json({
                error: true,
                message: "A user with this email does not exist"
            });
        }

        var resetToken = md5(code);

        //Check for exixting
        var formerCode = await UserCode.findOne({ where: { email: data.email, type: "reset" } });

        if (!formerCode) {
            UserCode.create({
                email: data.email,
                type: "reset",
                code: resetToken
            }).catch(error => {
                console.log(error.sqlMessage)
            });
        } else {
            UserCode.update({ code: resetToken },
                {
                    where: { email: data.email, type: "reset" }
                }).catch(error => {
                    console.log(error.sqlMessage)
                });
        }

        Mailer()
            .to(data.email).from(process.env.MAIL_FROM)
            .subject('Reset Password')
            .template('emails.ResetEmail', { resetLink: `${refererUrl}resetpassword/${resetToken}` }).send();


        res.status(200).json({
            status: true,
            message: "Code sent successfully"
        });

    }

    static async verifyResetToken(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var userCode = await UserCode.findOne({ where: { code: data.token } });

        if (!userCode) {
            res.status(400).json({
                status: false,
                message: "Invalid token"
            });
        }

        res.status(200).json({
            status: true,
            message: "Valid token"
        });

    }

    static async resetPassword(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const data = req.body;

        var getCode = await UserCode.findOne({ where: { code: data.token, type: "reset" } });

        if (!getCode) {
            return res.status(400).json({
                error: true,
                message: "Invalid reset request"
            });
        }


        var user = await User.findOne({ where: { email: getCode.email } });

        if (!user) {
            return res.status(200).json({
                error: true,
                message: "A user with this email does not exist"
            });
        }

        let encryptedPassword = await bcrypt.hash(data.password, 10);

        await User.update({
            password: encryptedPassword
        }, { where: { id: user.id } });

        res.status(200).json({
            status: true,
            message: "Password reset successfully"
        });

    }

    /* ---------------------------- ENDPONT FOR BATCHUPLOAD --------------------------- */
    static async BatchUserUpload(req, res) {

        try{
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const data = req.body;
            let user = await UserAuthController.batchUser(data);
            console.log("log");
    
            if (!user) {
                console.log(user)
                return res.status(400).json({
                    error: true,
                    status: false,
                    message: user
                });
            }
    
            if (data.has_company) {
                var response = await UserAuthController.batchCompany(user, data);
                if (response.error) {
                    
                    return res.status(400).json({
                        error: true,
                        message: response.message
                    });
                }
            }
    
            var UserTypeModel = data.user_type == "merchant" ? Merchant : Corporate;
           
            let change;
            if (data.user_type == "merchant") {
               
                var merchantType = await MerchantType.findOne({ where: { title: 'grower' } });
                if (merchantType) {
                    change = { type_id: merchantType.id };
                }
            } else {
                change = { type: "red-hot" };
                
            }
    
            await UserTypeModel.create({ ...change, ...{ user_id: user.id } }).catch((error => {
                return res.status(400).json({
                    error: true,
                    message: error
                });
            }));
    
            return res.status(200).json({
                error: false,
                status: true,
               message: "Successful"
            });

        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error on user batch upload",
                error_description: err.toString(),
                route: "/api/admin/users/batchuser",
                error_code: "500"
            });
            if(logError){
                return {
                    error: true,
                    message: 'Unable to complete request at the moment' + err.toString(),
                    
                }

            }
        }

    }



    
    static async batchUser(data) {
        try{
       /* ---------------------------- Receive JSON ARRAY --------------------------- */

       /* ------------------------------- create user ------------------------------ */
       const checkUser = await User.findOne({where:{
        [Op.or]: [
            {email: data.email},
            {phone: data.phone}
        ],
    }});

    if(checkUser){
        return {
            error:true,
            message: "User with this email or phone number already exist"
           };
    }else{
        let encryptedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        is_verified: 0,
        status: 1,
        password: encryptedPassword,
        type: data.user_type,
        account_type: data.has_company || data.company_email ? "company" : "individual",
  
  });

  
  if(user){
    /* -------------------------- upload and verify user kycdocs ------------------------- */
    const userKycdocs = await Kycdocs.create({
        user_id:user.id,
        id_type: data.id_type,
        id_front: data.id_front,
        id_back:data.id_back,
        id_number: data.id_number

    });

    /* ----------------------- upload and verify user kyc ----------------------- */
    const applicantId = crypto.randomBytes(16).toString("hex");
    const checkedId = crypto.randomUUID();

    const kycVerification = await KYC.create({
        user_id: user.id,
        applicant_id: applicantId,
        check_id: checkedId,
        status: "complete",
        bvn:  EncryptConfig(data.bvn),
        verified: 1

    });

    // Create user wallet
    let wallet = await Wallet.create({
            user_id: user.id,
            balance: 0
        });
    }
    return user.id;
    }

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on batchupload",
            error_description: error.toString(),
            route: "/api/admin/user/account/batchuser",
            error_code: "500"
        });
        if(logError){
            return {
                error: true,
                message: 'Unable to complete request at the moment' + " " + error.toString(),
            };
         }
        }
        
    }

    static async batchCompany(user, data) {
        
        try{
            /* ---------------------------- add company info ---------------------------- */
      const company = await Company.create({
        user_id: user.id,
        company_name: data.company_name,
        company_address: data.company_address,
        company_phone: data.company_phone,
        company_email: data.company_email,
        state: data.company_state,
        country: data.company_country,
        contact_person: data.contact_person,
        rc_number: data.rc_number,
        company_website: data.company_website
    });
        if(company){
    /* --------------------------- upload kyb document -------------------------- */
    let checkeId = crypto.randomUUID();
    const userKyb = await KYB.create({
        user_id:user.id,
        tax_id: data.tax_id,
        cac: data.cac,
        financial_statement: data.financial_statement,
        mou: data.mou,
        check_id: checkeId,
        status: "pending"
    });
}

        }catch(error){
                var logError = await ErrorLog.create({
                    error_name: "Error on batchupload",
                    error_description: error.toString(),
                    route: "/api/admin/user/account/batchuser",
                    error_code: "500"
                });
                if(logError){
                    
                    return {
                        error: true,
                        message: 'Unable to complete request at the moment' + " " + error.toString(),
                    }
                 }
             }
           
        }

        /* ---------------------------- update kyb status --------------------------- */
        static async updatekybStatus(req, res){

            try{

                const updateStatus = await KYB.update({
                   status:req.body.status,
                },{where:{user_id : req.body.user_id}});

                if(updateStatus){
                    return res.status(200).json({
                        error:false,
                        message:"KYB status updated"
                    })
                }else{
                    return res.status(200).json({
                        error: false,
                        message:"Failed to update kyb status"
                    })
                }
            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on updating kyb status",
                    error_description: err.toString(),
                    route: "/api/admin/user/account/updatekybstatus",
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

        /* ---------------------- update and verify kyc status ---------------------- */

        static async updatekycStatus(req, res){

            try{

                const updateStatus = await KYC.update({
                   status:req.body.status,
                   verified:req.body.verified
                },{where:{user_id : req.body.user_id}});

                if(updateStatus){
                    return res.status(200).json({
                        error:false,
                        message:"KYC status updated"
                    })
                }else{
                    return res.status(200).json({
                        error: false,
                        message:"Failed to update kyc status"
                    })
                }
            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on updating kyc status",
                    error_description: err.toString(),
                    route: "/api/admin/user/account/updatekycstatus",
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

        static async changeUserPassword(req, res){
            try{

                var newpassword = await bcrypt.hash(req.body.password, 10);

                var changePassword = await User.update({
                    password:newpassword
                },{where : {id : req.body.user_id}

                });

                /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);
                await Activitylog.create({
                    admin_id:adminId ,
                    section_accessed:'Change user password',
                    page_route:'/api/admin/user/changeuserpassword',
                    action:'Changed user password'
                });
                 /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

                if(changePassword){

                    try {
                        mailer().to(req.body.email).from(process.env.MAIL_FROM)
                        .subject('Change password').template("emails/ChangePassword").send();
                       
                       
                    } catch (error) {
                        
                    }

                    return res.status(200).json({
                        error : false,
                        message : "password was changed successfully"
                    })


                }else{
                    return res.status(400).json({
                        error : true,
                        message : "failed to change password"
                    })
                }

            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on changing user password",
                    error_description: err.toString(),
                    route: "/api/admin/user/changeuserpassword",
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

        // vfd endpoint 

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
            const c_key = `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`;
  const base64Data = Buffer.from(c_key).toString('base64');
  console.log(base64Data)
      
            axios.post('https://api.example.com/endpoint', requestData)
    .then(response => {
      // Handle the response
      
      res.json(response.data);
    })
    .catch(error => {
      // Handle any errors
      res.status(500).json({ error: 'An error occurred' });
    });
        }
        



    
        
    }


module.exports = UserAuthController;