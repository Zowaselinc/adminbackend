
const { request } = require("express");
const {Assignnegotiation, ErrorLog, Activitylog, Negotiation, Admin} = require("~database/models");
// const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");
const { IncludeAssignAdmin } = require("~database/helpers/modelncludes");
var cache = require('memory-cache');
class Assign_negotiationController{

/* ----------------- CREAT OR ASSIGN NEGOTIATION TO AN ADMIN ---------------- */
   static async assignNegotiationtoAdmin(req, res){
    try{

        // check and confirm that negotiation id does not repeat itself 
       var checkConversation = await Assignnegotiation.findOne({
            where:{conversationid:req.body.conversation_id}
        });

        if(checkConversation){
            return res.status(200).json({
                error:true,
                message: "Conversation id already exist"
            })
        }else{
            var assignNegotiation = Assignnegotiation.create({
                conversationid:req.body.conversation_id,
                adminassigned:req.body.adminassigned
            });

            if(assignNegotiation){
                return res.status(200).json({
                    error:false,
                    message:"Negotiation assigned successfully"
                })
            }else{
                return res.status(200).json({
                    error: true,
                    message : "Failed to assign negotiation"
                })
            }
        }

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "error on assigning negotiation to admin",
            error_description: error.toString(),
            route: "/api/admin/assignnegotiation/add",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            });
        }


    }
   
   }


  

   /* ----------------- GET ALL NEGOTIATIONS ASSIGNED TO ADMIN ----------------- */
   static async getAllAssignedNegotiations(req, res){
    try{
        let alladmins = JSON.parse(cache.get("admins"));
        let conversations =JSON.parse(cache.get("conversations"));
        // console.log(cache.get("admins"));
        //create empty array
        let assignedadmins =[];
        //get all assignments
        var allAssignNegotiation = await Assignnegotiation.findAll();
      //looop through and find the admin by id
        allAssignNegotiation.forEach(element => {
              
            let theadmin = element.dataValues; 

            //filter the admin who has that id
           let theadminassigned = alladmins.filter(x => x.admin_id==theadmin.adminassigned);
           let aconversation = conversations.filter(x => x.conversationid== theadmin.conversationid);

           //store the admin assigneds full details
           theadmin.administrator =theadminassigned;
           theadmin.conversation = aconversation;
           //store the push 
            assignedadmins.push(theadmin);
        });




        if(assignedadmins){
            return res.status(200).json({
                error:false,
                message:"Assigned negotiations retrived",
                data: assignedadmins
            });
        }else{
            return res.status(200).json({
                error : true,
                message: "Failed to retrive assigned negotiations"
            })
        }

    }catch(error){
        console.log(error);
        var logError = await ErrorLog.create({
            error_name: "Error on getting all assigned negotiations",
            error_description: error.toString(),
            route: "/api/admin/assignnegotiation/getall",
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

   /* --------------------- GET ASSIGNED NEGOTIATION BY ID --------------------- */
   static async getassignNegotiationbyid(req,res){
    try{
       
        var assignNegotiationid = await Assignnegotiation.findOne({where: {id:req.params.id}});

        
        if(assignNegotiationid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid id'
            })

        }else if(assignNegotiationid){
            return res.status(200).json({
                error:false,
                message: "Assigned negotiation acquired successfully",
                data: assignNegotiationid
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire assigned negotiation",
               
            });
        }

       

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on getting assign negotiation by id",
            error_description: error.toString(),
            route: "/api/admin/assignnegotiation/getbyid/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            });
          } 
        }
      }
    //   end 


      /* ------------------ GET ASSIGNED NEGOTIATION BY NEGOTIATION ID ------------------ */

   static async getbyConversationId(req,res){
    try{
       
        var getbyNegotiationid = await Assignnegotiation.findOne({where: {conversationid:req.params.conversationid}});

        
        if(getbyNegotiationid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid id'
            })

        }else if(getbyNegotiationid){
            return res.status(200).json({
                error:false,
                message: "Assigned negotiation acquired successfully",
                data: getbyNegotiationid
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire assigned negotiation",
               
            });
        }

       

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on getting assign negotiation by negotiation id",
            error_description: error.toString(),
            route: "/api/admin/assignnegotiation/getbyconversationid/:conversationid",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            });
          } 
        }
      }


      /* -------------- GET BY ASSIGNED NEGOTIATION BY ADMINASSIGNED -------------- */

      static async getbyAdminassigned(req,res){
        try{
           
            var getbyadminAssigned = await Assignnegotiation.findAll({where: {adminassigned:req.params.adminassigned}});

            if(getbyadminAssigned == null){
                return res.status(200).json({
                    error:true,
                    message: 'Invalid id'
                })
    
            }else if(getbyadminAssigned){
                return res.status(200).json({
                    error:false,
                    message: "Assigned negotiation acquired successfully",
                    data: getbyadminAssigned
                })
            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire assigned negotiation",
 
                });
            }

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting assign negotiation by adminassigned id",
                error_description: error.toString(),
                route: "/api/admin/assignnegotiation/getbyadminassigned/:adminassigned",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                });
              } 
            }
          }


      /* ---------------------------- EDIT  ASSIGNED NEGOTION BY ID ---------------------------- */
static async editAssignNegotiation(req,res){
    try{

        var editassNegotiation = await Assignnegotiation.update({
            negotiationid:req.body.negotiation_id,
            adminassigned:req.body.adminsigned
        },{where: {id:req.body.id}});

        if(editassNegotiation){
            return res.status(200).json({
                error : false,
                message : "Assigned negotiation edited successfully",
            });
            
        }else {
            return res.status(200).json({
                error : true,
                message : "Failed to edit assign negotiation",
            });
        }

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on editting assigned negotiation",
            error_description: error.toString(),
            route: "/api/admin/assignnegotiation/edit",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment',
            });
          } 
    }
}

/* ---------------------------- DELETE ASSIGNED NEGOTIATION BY ID --------------------------- */
static async deleteAssNegotiation(req, res){
    try{

    var delassNegotiation = await Assignnegotiation.destroy({where: {id:req.params.id}});

   
    if(delassNegotiation ){
        return res.status(200).json({
            error : false,
            message : "assign negotiation deleted succesfully",
        })
    }else{
        return res.status(200).json({
            error : true,
            message : "Failed to delete assign negotiation",
        })
    }
}catch(error){
        var  logError = await ErrorLog.create({
        error_name: "Error on deleting assigned negotiation",
        error_description: error.toString(),
        route: "/api/admin/assignnegotiation/delete/:id",
        error_code: "500"
    });
    if(logError){
        return res.status(500).json({
            error: true,
            message: 'Unable to complete request at the moment',
        });
      }
}
}



}
module.exports =Assign_negotiationController;
