const { request } = require("express");
const {Role, ErrorLog} = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

class RoleController{

    /* --------------------------- ADD ROLES END POINT -------------------------- */
    static async createRoles(req,res){
        try{
            const roleid = crypto.randomBytes(16).toString("hex")
        var role = await Role.create({
            role_id:"ZWLROL"+ roleid,
            role_name:req.body.role_name,
            role_description:req.body.role_description
        });
          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Create admin role',
            page_route:'/api/admin/roles/add',
            action:'Creating administrative roles '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        if(role){
            return res.status(200).json({   
                error : false,
                 message : "Role created succesfully"
             });
        }else{
            return res.status(200).json({   
                error : true,
                 message : "Failed to create role"
             });
        }
        
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating admin role",
                error_description: e.toString(),
                route: "/api/admin/roles/add",
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


    /* ------------------------------ GET ALL ROLES ----------------------------- */
    static async getAllRoles(req,res){
        try{

            var allroles = await Role.findAll();
              /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View all administrative roles',
          page_route:'/api/admin/roles/getall',
          action:'Viewing all administrative roles'
      });
       /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

            if(allroles){
                return res.status(200).json({
                    error:false,
                    message: "Roles acquired successfully",
                    data: allroles
                });

            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire roles",
                    data: allroles
                });
            }

            

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all roles",
                error_description: e.toString(),
                route: "/api/admin/roles/getall",
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



/* ----------------- GET ROLES BY PARAMS (LIMIT AND OFFSET ) ---------------- */
static async getRolesbyparams(req,res){
    try{

        const limit = Number(req.params.limit);
        const offset = Number(req.params.offset);
        var rolesparams = await Role.findAll({
            limit:limit,
            offset:offset
        });

          /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'View administrative roles by offset and limit',
            page_route:'/api/admin/roles/getallparams',
            action:'Viewing sets of administrative roles in the list '
        });
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(rolesparams ){
            return res.status(200).json({
                error:false,
                message: "roles acquired successfully",
                data: rolesparams
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire roles",
              
            })
        }

    }catch(e){
         var logError = await ErrorLog.create({
                error_name: "Error on getting roles by params",
                error_description: e.toString(),
                route: "/api/admin/roles/getallparams/:offset/:limit",
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

/* ----------------------------- GET ROLE BY ID ----------------------------- */
static async getRolesbyid(req,res){
    try{
       
        var role = await Role.findOne({where: {id:req.params.id}});

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'View administrative roles by id',
           page_route:'/api/admin/roles/getbyid/:id',
           action:'Viewing administrative roles in the list '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(role == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })

        }else if(role){
            return res.status(200).json({
                error:false,
                message: "Role acquired successfully",
                data: role
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire role",
               
            });
        }

       

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting roles by params",
            error_description: e.toString(),
            route: "/api/admin/roles/getbyid/:id",
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


/* -------------------------- GET ROLES BY ROLE ID -------------------------- */
static async getRolebyroleid(req,res){
    try{
       
        var therole = await Role.findOne({where: {role_id:req.params.role_id}});
         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'View administrative roles by roleid',
           page_route:'/api/admin/roles/getbyroleid/:role_id',
           action:'Viewing sets of administrative roles in the list '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(therole == null){
            return res.status(200).json({
                error:true,
                message: 'Not found'
            })

        }else if(therole){
            return res.status(200).json({
                error:false,
                message: "Role acquired successfully",
                data: therole
            });
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire role",
            });
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting role by roleid",
            error_description: e.toString(),
            route: "/api/admin/roles/getbyid/:role_id",
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

/* ---------------------------- EDIT  ROLE ---------------------------- */
static async editRole(req,res){
    try{

        var editRoles = await Role.update({
            role_name:req.body.role_name,
            role_description:req.body.role_description
        },{where: {id:req.body.id}});

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Edit administrative role',
           page_route:'/api/admin/roles/edit',
           action:'Editing administrative role '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(editRoles == null){
            return res.status(200).json({
                error : true,
                message : "Not found",
               
            })

        }else {
            return res.status(200).json({
                error : false,
                message : "Role edited successfully",
                
            });
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting role",
            error_description: e.toString(),
            route: "/api/admin/roles/edit",
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

/* ---------------------------- DELETE ROLE BY ID --------------------------- */
static async deleteRole(req, res){
    try{

    var delrole = await Role.destroy({where: {id:req.params.id}});

     /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
     var adminId = await  serveAdminid.getTheId(req);

     await Activitylog.create({
       admin_id:adminId ,
       section_accessed:'Delete administrative role',
       page_route:'/api/admin/roles/delete/:id',
       action:'Deleted adminstrative role '
   });
    /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

    if(delrole){
        return res.status(200).json({
            error : false,
            message : "role deleted succesfully",
        })
    }else{
        return res.status(200).json({
            error : true,
            message : "Failed to delete role",
        })
    }
}catch(e){
        var  logError = await ErrorLog.create({
        error_name: "Error on deleting role",
        error_description: e.toString(),
        route: "/api/admin/roles/delete",
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
module.exports =RoleController;
