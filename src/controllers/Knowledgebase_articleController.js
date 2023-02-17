const { request } = require("express");
const { validationResult } = require("express-validator");
const { KnowledgebaseArticle, ErrorLog , Activitylog, } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs
const serveAdminid = require("~utilities/serveAdminId");


class Knowledgebase_articleController{
/* ----------------------- CREATE/ADD Article END POINT ----------------------- */
    static async createArticle(req, res){
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


            
            const articleid = crypto.randomBytes(16).toString("hex");
            
            var article = await KnowledgebaseArticle.create({

                article_id :"ATl" + articleid,
                title : req.body.title.trim(),
                body : req.body.body.trim(),
                category_id : req.body.category_id.trim()
               
            });
                    
                      /* ---------------------------------- Article ACTIVITY LOG --------------------------------- */
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'Adding new Article',
                        page_route:'/api/admin/article/add',
                        action:'Added new Article'
                    });
                     /* ---------------------------------- Article ACTIVITY LOG --------------------------------- */

            if(article){
                return res.status(200).json({
                    error : false,
                     message : "Article created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create article"
  
                 });

            }
        

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating article",
                error_description: e.toString(),
                route: "/api/admin/article/add",
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


/* ------------------------ GET ALL ARTICLE END POINT ------------------------ */
            static async getAllArticle(req, res){
          
                try{

                var articles = await KnowledgebaseArticle.findAll();
                   /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All article',
                       page_route:'/api/admin/article/getall',
                       action:'Viewing all article in the list'
                   });
                    /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
                if(articles){
                    return res.status(200).json({
                        error : false,
                        message: "Articles acquired successfully",
                        data : articles
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to fetch Articles",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all articles",
                    error_description: e.toString(),
                    route: "/api/admin/article/getall",
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

      /* --------------------------- GET ARTICLE BY PARAMS -------------------------- */
      static async getArticlebyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var articleparams = await KnowledgebaseArticle.findAll({
            limit:limit,
            offset:offset
        });
         /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View article by offset and limit',
          page_route:'/api/admin/article/getallparams',
          action:'Viewing sets of article in the list '
      });
       /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */

        if(articleparams){
            return res.status(200).json({
                error: false,
                message: 'Articles acquired successfully',
                data: articleparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire articles',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all articles by paprams",
            error_description: e.toString(),
            route: "/api/admin/article/getallparams/:offset/:limit",
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

    /* --------------------- GET ARTICLE BY ID ENDPOINT --------------------- */
    static async getArticlebyid(req,res){
        try{
        
        var articleid = await KnowledgebaseArticle.findOne({where: {id : req.params.id}});
            /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View article by id',
          page_route:'/api/admin/article/:id',
          action:'Viewing article by id '
      });
       /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */

        if(articleid == null){
            return res.status(200).json({
                error:true,
                message: 'invalid article id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Article acquired successfully',
                data: articleid
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting article by id",
            error_description: e.toString(),
            route: "/api/admin/article/getbyid/:id",
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


    /* --------------------- GET ARTICLE BY ARTICLEID ENDPOINT --------------------- */
    static async getArticlebyarticleid(req,res){
        try{

        var thearticleid = await KnowledgebaseArticle.findOne({where: {article_id : req.params.article_id}});

      /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View article by article id',
          page_route:'/api/admin/article/getbyarticleid/:article_id',
          action:'Viewing article by id '
      });
       /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */

        if(thearticleid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid article id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'article acquired successfully',
                data: thearticleid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting article by articleid",
            error_description: e.toString(),
            route: "/api/admin/article/getbyarticleid/:article_id",
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


    

    /* ---------------------- EDIT article BY ID END POINT ---------------------- */
    static async editArticlebyid(req, res){
        try{

            // const errors = validationResult(req);
  
            // if (!errors.isEmpty()) {
            // return res.status(400).json({
            //     errors:true,
            //     message: "All fields are required",
            //     data: {}
            //     });
            // }

        var editArticle = await KnowledgebaseArticle.update({
            title : req.body.title.trim(),
            body : req.body.body.trim(),
            category_id : req.body.category_id.trim()
            
        }, { where : {id : req.body.id } });


            /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit Article',
              page_route:'/api/admin/article/edit',
              action:'Updating article information '
          });
           /* ---------------------------------- article ACTIVITY LOG --------------------------------- */
    


        if(editArticle){
            return res.status(200).json({
                error : false,
                message : "Article edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit article",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting article by id",
            error_description: e.toString(),
            route: "/api/admin/article/edit",
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

    
    /* --------------------------- DELETE ARTICLE BY ID --------------------------- */
    static async deleteArticlebyid(req, res){
        try{

        var delArticleid = await KnowledgebaseArticle.destroy({ where : {id : req.params.id}});

         /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Delete article',
           page_route:'/api/admin/article/delete/:id',
           action:'Deleting article information '
       });
        /* ---------------------------------- ARTICLE ACTIVITY LOG --------------------------------- */

        if(delArticleid == null){
            return res.status(200).json({
                error : true,
                message : "Invalid article id",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Article deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting article by id",
            error_description: e.toString(),
            route: "/api/admin/article/delete/:id",
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

module.exports = Knowledgebase_articleController;

    