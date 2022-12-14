const { AccessToken, Admin} = require("~database/models");
const jwt = require("jsonwebtoken");
require('dotenv').config();
class AuthMiddleware{


    isValidAdmin(req,res){
        let headers = req.headers;
        if(headers.authorization){
            // res.status(400);
            // res.send('Not allowed');
        }
    }


  async  isAuthenticated (req,res){
        let headers = req.headers;
      
     
        try{

            let auth = headers.authorization.substring(7, headers.authorization.length);
            // let auth = headers.authorization;
            var data = jwt.decode(auth,{complete:false});
                console.log(data);
            var now = Math.floor((new Date()).getTime()/1000);
          
             var admin = await Admin.findByPk(data.id);
            console.log(admin)
            if(admin){

                if(now > data.exp){
                    return res.status(403).send("Expired token");
                }

            }else{
                return res.status(403).send("Unauthorized");
            }


        }
        catch(error){
             console.log(error);
            res.status(403);
            res.send('Forbidden req does not go thru');
            
        }

    }


}

module.exports = new AuthMiddleware();