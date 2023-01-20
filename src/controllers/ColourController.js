
const { request } = require("express");
const {Colour, ErrorLog, Activitylog} = require("~database/models");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class ColourController{

    /* --------------------------- ADD COLOURS END POINT -------------------------- */
    static async createColour(req,res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

            var confirmColour = await Colour.findOne({
                where:{
                    name:req.body.colour_name
                }
            });

            if(confirmColour){
                return res.status(200).json({
                    error: true,
                    message : "Colour name already exist"
                })
            }else{
                
                var colour = await Colour.create({
                    colour_id:req.body.colour_id,
                    name:req.body.colour_name,
                    
                });
                /* ---------------------------------- ACTIVITY LOG --------------------------------- */
                var adminId = await  serveAdminid.getTheId(req);
      
                await Activitylog.create({
                  admin_id:adminId ,
                  section_accessed:'add colours',
                  page_route:'/api/admin/colour/add',
                  action:'Adding crops colours '
              });
               /* ---------------------------------- ACTIVITY LOG --------------------------------- */
           
        if(colour){
            return res.status(200).json({   
                error : false,
                 message : "Colour created succesfully"
             });
        }else{
            return res.status(200).json({   
                error : true,
                 message : "Failed to create colour"
             });
        }
    }
        
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding crops colours",
                error_description: e.toString(),
                route: "/api/admin/colour/add",
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


    /* ------------------------------ GET ALL COLOURS ----------------------------- */
    static async getAllColours(req,res){
        try{

            var allcolours = await Colour.findAll();
              /* ---------------------------------- ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View all Colours',
          page_route:'/api/admin/colour/getall',
          action:'Viewing all colours in the list'
      });
       /* ---------------------------------- ACTIVITY LOG --------------------------------- */

            if(allcolours){
                return res.status(200).json({
                    error:false,
                    message: "colours acquired successfully",
                    data: allcolours
                });

            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire colours",
                    
                });
            }

            

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all colours",
                error_description: e.toString(),
                route: "/api/admin/colour/getall",
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



/* ----------------- GET COLOUR BY PARAMS (LIMIT AND OFFSET ) ---------------- */
static async getColourbyparams(req,res){
    try{

        const limit = Number(req.params.limit);
        const offset = Number(req.params.offset);
        var colourparams = await Colour.findAll({
            limit:limit,
            offset:offset
        });

          /* ---------------------------------- ACTIVITY LOG --------------------------------- */
          var adminId = await  serveAdminid.getTheId(req);

          await Activitylog.create({
            admin_id:adminId ,
            section_accessed:'Viewing colours by offset and limit',
            page_route:'/api/admin/colours/getallparams/:offset/:limit',
            action:'Viewing sets of colours in the list '
        });
         /* ---------------------------------- ACTIVITY LOG --------------------------------- */

        if(colourparams ){
            return res.status(200).json({
                error:false,
                message: "colours acquired successfully",
                data: colourparams
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire colours",
              
            })
        }

    }catch(e){
         var logError = await ErrorLog.create({
                error_name: "Error on getting colours by params",
                error_description: e.toString(),
                route: "/api/admin/colour/getallparams/:offset/:limit",
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

/* ----------------------------- GET COLOUR BY ID ----------------------------- */
static async getColourbyid(req,res){
    try{
       
        var colourid = await Colour.findOne({where: {id:req.params.id}});

         /* ---------------------------------- ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Viewing colour by id',
           page_route:'/api/admin/colour/getbyid/:id',
           action:'Viewing colours in the list '
       });
        /* ----------------------------------  ACTIVITY LOG --------------------------------- */

        if(colourid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid id'
            })

        }else if(colourid){
            return res.status(200).json({
                error:false,
                message: "Colour acquired successfully",
                data: colourid
            })
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire colour",
               
            });
        }

       

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting colour by id",
            error_description: e.toString(),
            route: "/api/admin/colour/getbyid/:id",
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


/* -------------------------- GET COLOUR BY COLOUR ID -------------------------- */
static async getColourbycolourid(req,res){
    try{
       
        var thecolour = await Colour.findOne({where: {colour_id:req.params.colour_id}});
         /* ---------------------------------- ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'View colour by colourid',
           page_route:'/api/admin/colour/getbycolourid/:colour_id',
           action:'Viewing  Colours in the list '
       });
        /* ---------------------------------- ACTIVITY LOG --------------------------------- */

        if(thecolour == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid colour id'
            })

        }else if(thecolour){
            return res.status(200).json({
                error:false,
                message: "Colour acquired successfully",
                data: thecolour
            });
        }else{
            return res.status(200).json({
                error:true,
                message: "Failed to acquire colour",
            });
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting colour by colour",
            error_description: e.toString(),
            route: "/api/admin/colour/getbyid/:colour_id",
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

/* ---------------------------- EDIT  COLOUR ---------------------------- */
static async editColour(req,res){
    try{

        var editcolour = await Colour.update({
            colour_id:req.body.colour_id,
            name:req.body.colour_name
        },{where: {id:req.body.id}});

         /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Edit Colours',
           page_route:'/api/admin/colour/edit',
           action:'Editing colour '
       });
        /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

        if(editcolour){
            return res.status(200).json({
                error : false,
                message : "Colour edited successfully",
            });
            
        }else {
            return res.status(200).json({
                error : true,
                message : "Failed to edit colour",
            });
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting colour",
            error_description: e.toString(),
            route: "/api/admin/colour/edit",
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

/* ---------------------------- DELETE COLOUR BY ID --------------------------- */
static async deleteColour(req, res){
    try{

    var delcolour = await Colour.destroy({where: {id:req.params.id}});

     /* ----------------------------------  ACTIVITY LOG --------------------------------- */
     var adminId = await  serveAdminid.getTheId(req);

     await Activitylog.create({
       admin_id:adminId ,
       section_accessed:'Delete colour',
       page_route:'/api/admin/colour/delete/:id',
       action:'Deleted colour '
   });
    /* ---------------------------------- ACTIVITY LOG --------------------------------- */

    if(delcolour){
        return res.status(200).json({
            error : false,
            message : "Colour deleted succesfully",
        })
    }else{
        return res.status(200).json({
            error : true,
            message : "Failed to delete colour",
        })
    }
}catch(e){
        var  logError = await ErrorLog.create({
        error_name: "Error on deleting colour",
        error_description: e.toString(),
        route: "/api/admin/colour/delete/:id",
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
module.exports =ColourController;
