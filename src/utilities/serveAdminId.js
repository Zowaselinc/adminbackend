
const jwt = require("jsonwebtoken");
const { Admin, } = require("~database/models");


exports.getTheId = async(req)=>{
    try {
        let headers = req.headers;
        // console.log(headers)
        let auth = headers.authorization.substring(7, headers.authorization.length);
    
        var data = await jwt.decode(auth,{complete:false});
        var admin = await Admin.findByPk(data.id);
        // console.log(admin);
        return admin.dataValues.admin_id;
    } catch (error) {
        
    }
   
};