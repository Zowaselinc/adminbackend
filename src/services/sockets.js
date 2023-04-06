const { mydb } = require("~utilities/backupdriver");
const { EncryptConfig } = require("~utilities/encryption/encrypt");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const MeshSockets=(io)=>{
  
   /* --------------------------------------------- LISTEN FOR A CONNECTION -------------------------------------------- */
    io.on("connection",function(socket){
        /* ----------------------------------- if a connection from front end has occured ----------------------------------- */
    socket.emit("isconnected","You are Connected in Real-Time , please check for data");

    
    
    
    
    
    



    
    /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
    socket.on("batchupload",function(data){
       console.log(data);
        let parseddata=JSON.parse(data);
        socket.emit("batchresponse",{"error":false,"message":"Batch Upload In Progress","status":"pending"});
       /* --------------------------- WRITE THE CODE TO STORE THE DATA AND LOOP THROUGH EACH DATA -------------------------- */

     
       /* ------------------------------------------ START THE UPLOAD OF THE DATA ------------------------------------------ */
         /* -------------------------------------------------- RUN THE LOOP -------------------------------------------------- */
            parseddata.userdata.forEach(async (element) => {
              
            /* ----------------------------------- UPLOAD TO TABLE ONE :::::::::: USERS TABLE ----------------------------------- */
                /* --------------------------------------- SET DEFAULT CONFIG FOR ACCOUNT TYPE -------------------------------------- */
                let account_type = "individual";
                if(element.has_company=="true"){ account_type="company"};
                let password= await bcrypt.hash(element.password, 10);
                await mydb.insert("users",{first_name:element.first_name,last_name:element.last_name,phone:element.phone,email:element.email,is_verified:1,status:1,password:password,type:element.user_type,account_type:account_type});


                /* ------------------------------------------- GET BACK THE USERS DETAILS ------------------------------------------- */
                let createduser = await mydb.select("users",{email:element.email});
                let userid =createduser[0].id;
             

                /* ------------------------------------ UPLOAD TO TABLE TWO :::::::::::::KYC DOCS ----------------------------------- */
                await mydb.insert("kyc_docs",{user_id:userid,id_type:element.id_type,id_front:element.id_front,id_back:element.id_back,id_number:element.id_number});
                const checkid= crypto.randomUUID();
                /* -------------------------------------- UPLOAD TO TABLE THREE:::::::::::::KYC ------------------------------------- */
                await mydb.insert("kycs",{user_id:userid,applicant_id:crypto.randomBytes(16).toString("hex"),check_id:checkid,status:"complete",bvn:EncryptConfig(element.bvn),verified:1});
                /* -------------------------- CREATE A WALLET FOR THE USER TABLE FOUR :::::::::::: WALLETS -------------------------- */
                await mydb.insert("wallets",{user_id:userid,balance:0});
                /* -------------------------------- UPLOAD TO TABLE COMPANY :TABLE FIVE::::::::: KYB ------------------------------- */
                if(element.has_company=="true"){  
                    await mydb.insert("companies",{user_id:userid,company_name:element.company_name,company_address:element.company_address,company_email:element.company_email,company_phone:element.company_phone,state:element.company_state,country:element.company_country,contact_person:element.contact_person,rc_number:element.rc_number,company_website:element.company_website})
                
                /* -------------------------------------- UPLOAD TO TABLE SIX::::::: KYB TABLE -------------------------------------- */
                    await mydb.insert("kybs",{user_id:userid,tax_id:element.tax_id,cac:element.cac,financial_statement:element.financial_statement,mou:element.mou,check_id:checkid,status:"complete"});
                 };

                 socket.emit("batchresponse",{"error":false,"message":"Batch Upload Successfully Completed","status":"complete"});
      










                
            });
                    
        
        // socket.emit("batchresponse",data);

    })
     /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
   
  











     /* ----------------------------- IF SOMEONE DISCONNECTS FROM THE SOCKET IT ALSO SHOWS UP ---------------------------- */
     socket.on("disconnect",function(){
        console.log("someone disconnected");
     })

    })
    
   
    






}

module.exports=MeshSockets;