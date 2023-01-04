
const { request } = require("express");
const { validationResult } = require("express-validator");
const { User, ErrorLog,MerchantType,  Company, Merchant, Partner, Corporate, Agent, Crop, CropRequest } = require("~database/models");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs

class UserController{
/* ----------------------- ADD MERCHANT----------------------- */
    static async registerMerchant(req, res){
        const data = req.body;

        let user = await UserController.saveUser(data);

        if(user.error){
            return res.status(400).json({
                error : true,
                message : user.message
            });
        }

        if(data.has_company){
            var response = await UserController.saveCompany(user,data);
            if(response.error){
                // await user.delete();
                return res.status(400).json({
                    error : true,
                    message : response.message
                });
            }
        }

        var UserTypeModel = data.user_type == "merchant" ? Merchant : Corporate;
        UserTypeModel.user_id = user.id;
        let change;
        if(data.user_type == "merchant"){
            // var merchantType = await MerchantType.findOne({ where : { title : data.merchant_type}});
            var merchantType = await MerchantType.findOne({ where : { title : 'grower'}});
            if(merchantType){
                change = { type_id : merchantType.id};
            }
        }else{
            change = {type : "red-hot"};
            // UserTypeModel.type = "red-hot";
        }

        await UserTypeModel.update(change , { where : {user_id : user.id}}).catch((error => {
          
          console.log(error);
            return res.status(400).json({
                error : true,
                message : error.sqlMessage,
                data:error
            });
        }));
        
     
    
        Mailer()
        .to(data.email).from(process.env.MAIL_FROM)
        .subject('Welcome').template('emails/WelcomeEmail').send();


        res.status(200).json({
            status : false,
            user : user
        });

    }



    static async saveUser(data){
        var user;
        let encryptedPassword = await bcrypt.hash(data.password, 10);

        try{
            user = await User.create({
                first_name : data.first_name,
                last_name : data.last_name,
                phone : data.phone,
                email : data.email,
                is_verified : 0,
                status : 1,
                password : encryptedPassword,
                type : data.user_type,
                account_type : data.has_company || data.company_email ? "company" : "individual"
            });
        }catch(e){
            user = {
                error : true,
                message : e.sqlMessage
            }
        }

        return user;
    }


    static async saveCompany(user,data){
        let company;

        try{
            company = await Company.create({
                user_id : user.id,
                company_name : data.company_name,
                company_address : data.company_address,
                company_phone : data.company_phone,
                company_email : data.company_email,
                state : data.company_state,
                rc_number : data.rc_number
            });
        }catch(e){
            company = {
                error : true,
                message : e.sqlMessage
            }
        }

        return company;
    }






/* ------------------------------ GET ALL USERS ----------------------------- */

    static async getAllUsers(req, res){

        // var users =await User.findAll();
        var merchants = await Merchant.findAll({ include : User});

        var corporates = await Corporate.findAll({ include : User});

        var agents = await Agent.findAll({ include : User});

        var partners = await Partner.findAll({ include : User});

        var resultSet = [...merchants, ...corporates , ...agents, ...partners];

        resultSet = resultSet.sort((a,b) => b.user_id - a.user_id);

        return res.status(200).json({
            error : false,
            message : "Users fetched successfully",
            data : resultSet
        });

    }

    static async getUsersByType(req , res){

        var result = [];

        if(req.params.type == "merchant"){
            result = await Merchant.findAll({ include : User });
        }

        if(req.params.type == "corporate"){
            result = await Corporate.findAll({ include : User});
        }

        if(req.params.type == "agent"){
            result = await Agent.findAll({ include : User});
        }

        if(req.params.type == "partner"){
            result = await Partner.findAll({ include : User});
        }


        result = result.sort((a,b) => b.user_id - a.user_id);

        return res.status(200).json({
            error : false,
            message : "Users fetched successfully",
            data : result
            
        });
    }


    static async getUserById(req , res){

        var id = req.params.id;

        var userTypeMap = {
            merchant : Merchant,
            corporate : Corporate,
            agent : Agent,
            partner : Partner
        };

        let user = await User.findByPk(id);

        if(user){
            user = await userTypeMap[user.type].findOne({ where : {user_id : id} , include : User});
        }

        if(!user){
            return res.status(400).json({
                error : true,
                message : "User not found",
            });
        }


        return res.status(200).json({
            error : false,
            message : "User fetched successfully",
            data : user
            
        });
    }
    /* ------------------------- // get all users stats ------------------------- */
    static async getUserStats(req ,res){
        try{

    //    uers stats 
        var verifiedUsers = await User.findAll({where:{is_verified:'1'}});
        var activeUsers = await User.findAll({where:{active:'1'}});
        var totalUsers = await User.findAll();
        var totalMerchant = await User.findAll({where :{type:'merchant'}});
        var totalCorporate = await User.findAll({where :{type:'corporate'}});

        // fetch all users stats 
        return res.status(200).json({
            error:false,
            message:"Users stats fetched",
            data:[{
                "Totalusers":totalUsers.length,
                "TotalMerchant":totalMerchant.length,
                "TotalCorporate":totalCorporate.length,
                "VerifiedUsers":verifiedUsers.length,
                "ActiveUsers":activeUsers.length
        
        }]
        })
         }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting users stats",
                error_description: e.toString(),
                route: "/api/admin/users/getstats",
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

module.exports = UserController;

    