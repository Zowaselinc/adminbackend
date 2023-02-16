const { request } = require("express");
const { validationResult } = require("express-validator");
const { Page, ErrorLog , Activitylog, } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs
const serveAdminid = require("~utilities/serveAdminId");
class PageController{
/* ----------------------- CREATE/ADD PAGE END POINT ----------------------- */
    static async createPage(req, res){
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


            
            const pageid = crypto.randomBytes(16).toString("hex");
            
            var page = await Page.create({

                page_id :"PAG"+pageid,
                page_name : req.body.page_name.trim(),
                page_description : req.body.page_description.trim(),
               
            });
                    
                      /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'Adding new page',
                        page_route:'/api/admin/page/add',
                        action:'Added new page'
                    });
                     /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

            if(page){
                return res.status(200).json({
                    error : false,
                     message : "Page created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create page"
  
                 });

            }
        

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating Page",
                error_description: e.toString(),
                route: "/api/admin/page/add",
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


/* ------------------------ GET ALL PAGES END POINT ------------------------ */
            static async getAllPages(req, res){
          
                try{

                var pages = await Page.findAll();
                   /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All pages',
                       page_route:'/api/admin/page/getall',
                       action:'Viewing all pages in the list'
                   });
                    /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
                if(pages){
                    return res.status(200).json({
                        error : false,
                        message: "Pages acquired successfully",
                        data :pages
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to fetch Pages",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Pages",
                    error_description: e.toString(),
                    route: "/api/admin/page/getall",
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

      /* --------------------------- GET PAGE BY PARAMS -------------------------- */
      static async getPagebyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var pageparams = await Page.findAll({
            limit:limit,
            offset:offset
        });
         /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View pages by offset and limit',
          page_route:'/api/admin/page/getallparams',
          action:'Viewing sets of pages in the list '
      });
       /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

        if(pageparams){
            return res.status(200).json({
                error: false,
                message: 'Page acquired successfully',
                data: pageparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Page',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Pages by paprams",
            error_description: e.toString(),
            route: "/api/admin/page/getallparams/:offset/:limit",
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

    /* --------------------- GET PAGE BY ID ENDPOINT --------------------- */
    static async getPagebyid(req,res){
        try{
        
        var pageid = await Page.findOne({where: {id : req.params.id}});
            /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View page by id',
          page_route:'/api/admin/page/:id',
          action:'Viewing block by id '
      });
       /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

        if(pageid == null){
            return res.status(200).json({
                error:true,
                message: 'invalid page id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'page acquired successfully',
                data: pageid
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting page by id",
            error_description: e.toString(),
            route: "/api/admin/page/getbyid/:id",
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


    /* --------------------- GET PAGE BY PAGE ID ENDPOINT --------------------- */
    static async getPagebyPageid(req,res){
        try{

        var thePageid = await Page.findOne({where: {page_id : req.params.page_id}});

      /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View page by page id',
          page_route:'/api/admin/page/getbypageid/:page_id',
          action:'Viewing page by id '
      });
       /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */

        if(thePageid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid page id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'page acquired successfully',
                data: thePageid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Page by pageid",
            error_description: e.toString(),
            route: "/api/admin/page/getbypageid/:page_id",
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


    

    /* ---------------------- EDIT page BY ID END POINT ---------------------- */
    static async editPagebyid(req, res){
        try{

            // const errors = validationResult(req);
  
            // if (!errors.isEmpty()) {
            // return res.status(400).json({
            //     errors:true,
            //     message: "All fields are required",
            //     data: {}
            //     });
            // }

        var editPage = await Page.update({
            page_name : req.body.page_name,
            page_description : req.body.page_description
            
        }, { where : {id : req.body.id } });

            /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit Page',
              page_route:'/api/admin/page/edit',
              action:'Updating page information '
          });
           /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
    


        if(editPage){
            return res.status(200).json({
                error : false,
                message : "Page edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit page",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting page by id",
            error_description: e.toString(),
            route: "/api/admin/page/edit",
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

    
    /* --------------------------- DELETE ADMIN BY ID --------------------------- */
    static async deletePagebyid(req, res){
        try{

        var delPageid = await Page.destroy({ where : {id : req.params.id}});

         /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Delete Page',
           page_route:'/api/admin/page/delete/:id',
           action:'Deleting page information '
       });
        /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

        if(delPageid == null){
            return res.status(200).json({
                error : true,
                message : "Invalid page id",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Block deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Page by id",
            error_description: e.toString(),
            route: "/api/admin/page/delete/:id",
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

module.exports = PageController;

    