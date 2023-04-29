const { request } = require("express");
const { validationResult } = require("express-validator");
const { KnowledgebasCategory, ErrorLog , Activitylog, } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs
const serveAdminid = require("~utilities/serveAdminId");


class Knowledgebase_categoryController{
/* ----------------------- CREATE/ADD KBCATEGORY END POINT ----------------------- */
    static async createKBcategory(req, res){
        try{
            var adminId = await  serveAdminid.getTheId(req);

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }


            
            const kbcategoryid = crypto.randomBytes(16).toString("hex");
            
            var kbcategory = await KnowledgebasCategory.create({

                category_id :"KBCT" + kbcategoryid,
                category_name : req.body.category_name.trim(),
                category_description : req.body.category_description.trim()
                
               
            });
                    
                      /* ---------------------------------- knowledgebase category ACTIVITY LOG --------------------------------- */
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'Adding new knowledgebase category',
                        page_route:'/api/admin/kbcategory/add',
                        action:'Added new Knowledgebase category'
                    });
                     /* ---------------------------------- knowledgebase category ACTIVITY LOG --------------------------------- */

            if(kbcategory){
                return res.status(200).json({
                    error : false,
                     message : "Knowledgebase category created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create knowledgebase category"
  
                 });

            }
        

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating knowledgebase category",
                error_description: e.toString(),
                route: "/api/admin/kbcategory/add",
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
    /* -------------------------------------------------------------------------- */


/* ------------------------ GET ALL KNOWLEDGEBASE CATEGORY END POINT ------------------------ */
            static async getAllKBcategory(req, res){
          
                try{

                var kbCategories = await KnowledgebasCategory.findAll();
                   /* ---------------------------------- knowledgebase category ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All knowledgebase category',
                       page_route:'/api/admin/kbcategory/getall',
                       action:'Viewing all knowledgebase category in the list'
                   });
                    /* ---------------------------------- knowledgebase category ACTIVITY LOG --------------------------------- */
                if(kbCategories){
                    return res.status(200).json({
                        error : false,
                        message: "Knowledgebase category acquired successfully",
                        data : kbCategories
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to fetch Knowledgebase category",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all knowledgebase category",
                    error_description: e.toString(),
                    route: "/api/admin/kbcategory/getall",
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

      /* --------------------------- GET KNOWLEDGEBASE CATEGORY BY PARAMS -------------------------- */
      static async getKBcategorybyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var kbcategoryparams = await KnowledgebasCategory.findAll({
            limit:limit,
            offset:offset
        });
         /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View knowledgebase category by offset and limit',
          page_route:'/api/admin/kbcategory/getallparams',
          action:'Viewing sets of knowledgebase category in the list '
      });
       /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */

        if(kbcategoryparams){
            return res.status(200).json({
                error: false,
                message: 'Knowledgebase category acquired successfully',
                data: kbcategoryparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Knowledgebase category',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all knowledgebase category by paprams",
            error_description: e.toString(),
            route: "/api/admin/kbcategory/getallparams/:offset/:limit",
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

    /* --------------------- GET KNOWLEDGEBASE CATEGORY BY ID ENDPOINT --------------------- */
    static async getKBcategorybyid(req,res){
        try{
        
        var kbcateGoryid = await KnowledgebasCategory.findOne({where: {id : req.params.id}});
            /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View knowledgebase category by id',
          page_route:'/api/admin/kbcategory/:id',
          action:'Viewing knowledgebase category by id '
      });
       /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */

        if(kbcateGoryid == null){
            return res.status(200).json({
                error:true,
                message: 'invalid knowledgebase category id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'knowledgebase category acquired successfully',
                data: kbcateGoryid
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting knowledgebase category by id",
            error_description: e.toString(),
            route: "/api/admin/kbcategory/getbyid/:id",
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


    /* --------------------- GET KNOWLEDGEBASE CATEGORY BY KNOWLEDGEBASE CATEGORY ID ENDPOINT --------------------- */
    static async getkbcategorybycategoryid(req,res){
        try{

        var thekbcategoryid = await KnowledgebasCategory.findOne({where: {category_id : req.params.category_id}});

      /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View knowledgebase category by category id',
          page_route:'/api/admin/kbcategory/getbycategoryid/:category_id',
          action:'Viewing knowledgebase category by id '
      });
       /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */

        if(thekbcategoryid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid knowledgebase category id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'knowledgebase category acquired successfully',
                data: thekbcategoryid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on knowledgebase category  by category id",
            error_description: e.toString(),
            route: "/api/admin/kbcategory/getbycategoryid/:category_id",
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


    

    /* ---------------------- EDIT KNOWLEDGEBASE CATEGORY BY ID END POINT ---------------------- */
    static async editkbCategorybyid(req, res){
        try{

           

        var editkbcategory = await KnowledgebasCategory.update({
            category_name : req.body.category_name.trim(),
            category_description : req.body.category_description.trim()
            
        }, { where : {id : req.body.id } });


            /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit knnowledgebase category',
              page_route:'/api/admin/kbcategory/edit',
              action:'Updating knnowledgebase category information '
          });
           /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
    


        if(editkbcategory){
            return res.status(200).json({
                error : false,
                message : "Knowledgebase category edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit Knowledgebase category",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting knowledgebase category by id",
            error_description: e.toString(),
            route: "/api/admin/kbcategory/edit",
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

    
    /* --------------------------- DELETE KNOWLEDGEBASE CATEGORY BY ID --------------------------- */
    static async deletekbCategorybyid(req, res){
        try{

        var delkbCategoryid = await KnowledgebasCategory.destroy({ where : {id : req.params.id}});

         /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Delete knowledgebase category',
           page_route:'/api/admin/kbcategory/delete/:id',
           action:'Deleting knowledgebase category information '
       });
        /* ---------------------------------- KNOWLEDGEBASE CATEGORY ACTIVITY LOG --------------------------------- */

        if(delkbCategoryid == null){
            return res.status(200).json({
                error : true,
                message : "Invalid knowledgebase category id",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "knowledgebase category deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting knowledgebase category by id",
            error_description: e.toString(),
            route: "/api/admin/kbcategory/delete/:id",
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

module.exports = Knowledgebase_categoryController;

    