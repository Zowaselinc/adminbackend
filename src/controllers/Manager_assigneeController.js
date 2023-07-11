const { request } = require("express");
const { validationResult } = require("express-validator");
const { ErrorLog, Activitylog, ManagerAssignee, User, Role, Admin } = require("~database/models");


const serveAdminid = require("~utilities/serveAdminId");
class Manager_assigneeController{
/* ----------------------- CREATE/ADD ADMIN END POINT ----------------------- */
    static async createManagerAssignee(req, res){
        try{
           

            // const errors = validationResult(req);
  
            // if (!errors.isEmpty()) {
            // return res.status(400).json({
            //     errors:true,
            //     message: "All fields are required",
            //     data: {}
            //     });
            // }
            // check if a user has been assigned to an admin, that same user should not be assigned to that admin again 

            // var checkUser = await ManagerAssignee.findOne({where: {user_id : req.body.user_id}});

            // if(checkUser){
            //     return res.status(400).json({
            //         error:true,  
            //         message : "This user has already been assigned to an admin"
            //     })
            // }else{

            var theManagerAssignee = await ManagerAssignee.create({
                admin_id:req.body.admin_id,
                user_id : req.body.user_id,
                assigned_by : req.body.assigned_by,
                date_assigned : req.body.date_assigned
            });
                    
                      /* ----------------------------------  ACTIVITY LOG --------------------------------- */
                      var adminId = await  serveAdminid.getTheId(req);
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'Adding Manager assignee',
                        page_route:'/api/admin/manager/add',
                        action:'Added new manager assignee'
                    });
                     /* ----------------------------------  ACTIVITY LOG --------------------------------- */

            if(theManagerAssignee){
                return res.status(200).json({
                    error : false,
                     message : "Manager assignee created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create Manager assignee"
  
                 });

            }
        // }

        }catch(err){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Assigning Manager",
                error_description: err.toString(),
                route: "/api/admin/manager/add",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+ "" + err.toString(),
                    
                })

            }

        }
    }
    /* -------------------------------------------------------------------------- */


/* ------------------------ GET ALL MANAGER ASSIGNEE END POINT ------------------------ */
            static async getAllManagerAssignee(req, res){
          
                try{

                var allManager = await ManagerAssignee.findAll();
                   /* ----------------------------------  ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All Manager assignee',
                       page_route:'/api/admin/manager/getall',
                       action:'Viewing all assigned managers in the list'
                   });
                    /* ----------------------------------  ACTIVITY LOG --------------------------------- */
                if(allManager){
                    return res.status(200).json({
                        error : false,
                        message: "Manager assignee acquired successfully",
                        data : allManager
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to fetch manager assignee",
                    });

                }

            }catch(err){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all manager assignee",
                    error_description: err.toString(),
                    route: "/api/admin/manager/getall",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment' + "" + err.toString(),
                        
                    })
    
                }
            }
            }

     

    /* --------------------- GET ADMIN BY ADMIN ID ENDPOINT --------------------- */
    static async getManagerAsigneebyid(req,res){
        try{
        
        var managerId = await ManagerAssignee.findOne({where: {id : req.params.id}});
            var admin = managerId.dataValues.admin_id;
            var gettheAdmin = await Admin.findOne({where:{admin_id:admin}})

            delete gettheAdmin.dataValues.created_at;
            delete gettheAdmin.dataValues.updated_at;
            delete gettheAdmin.dataValues.password;


            var user = managerId.dataValues.user_id;
            var getUser= await User.findOne({where:{id:user}})

            delete getUser.dataValues.created_at;
            delete getUser.dataValues.updated_at;
            delete getUser.dataValues.password;


            var themanager = managerId.dataValues;
            themanager.admin= gettheAdmin.dataValues;
            themanager.user = getUser.dataValues;

        if(managerId  == null){
            return res.status(200).json({
                error:true,
                message: 'invalid admin id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Admin acquired successfully',
                data: themanager
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting manager assignee by id",
            error_description: e.toString(),
            route: "/api/admin/manager/getbyid/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment' + "" + e.toString(),
                
            })

        }
    }
    }


    

    /* ---------------------- EDIT ADMIN BY admin ID END POINT ---------------------- */
    static async editManagerassignee(req, res){
        try{

            
        var editManager = await ManagerAssignee.update({
            admin_id:req.body.admin_id,
            user_id : req.body.user_id,
            assigned_by : req.body.assigned_by,
            date_assigned : req.body.date_assigned
        }, { where : { id : req.body.id } });


            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit manager assignee',
              page_route:'/api/admin/manager/edit',
              action:'Updating manager assignee information '
          });
           /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
    


        if(editManager){
            return res.status(200).json({
                error : false,
                message : "Manager assignee edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit manager assignee",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting manager assignee by id",
            error_description: e.toString(),
            route: "/api/admin/manager/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment' + "" + e.toString(),
                
            })

        }
    }
    }
   

   
    /* --------------------------- DELETE ADMIN BY ID --------------------------- */
    static async delManagerAssigneeid(req, res){
        try{

        var delManager = await ManagerAssignee.destroy({ where : {id : req.params.id}});

        if(delManager == null){
            return res.status(200).json({
                error : true,
                message : "ID Not found",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Manager assignee deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting manager assignee by id",
            error_description: e.toString(),
            route: "/api/admin/manager/delete/:id",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment' + "" + e.toString(),
            })

        }
    }
    }


}

module.exports = Manager_assigneeController;

    