const { request } = require("express");
const { validationResult } = require("express-validator");
const { Block, ErrorLog , Activitylog, } = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs
const serveAdminid = require("~utilities/serveAdminId");
class BlockController{
/* ----------------------- CREATE/ADD PAGE END POINT ----------------------- */
    static async createBlock(req, res){
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


            
            const blockid = crypto.randomBytes(16).toString("hex");
            
            var block = await Block.create({

                block_id :"BLK"+blockid,
                block_name : req.body.block_name.trim(),
                block_description : req.body.block_description.trim(),
                block_content : req.body.block_content.trim(),
                page_id : req.body.page_id.trim(),
                priority:req.body.priority.trim(),
               
            });
                    
                      /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */
                     
                      await Activitylog.create({
                        admin_id:adminId ,
                        section_accessed:'Adding new block',
                        page_route:'/api/admin/block/add',
                        action:'Added new block'
                    });
                     /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */

            if(block){
                return res.status(200).json({
                    error : false,
                     message : "Block created succesfully"

                 });
 
            }else{
                return res.status(200).json({
                    error : true,
                     message : "Failed to create block"
  
                 });

            }
        

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating block",
                error_description: e.toString(),
                route: "/api/admin/block/add",
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


/* ------------------------ GET ALL BLOCK END POINT ------------------------ */
            static async getAllBlock(req, res){
          
                try{

                var blocks = await Block.findAll();
                   /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All blocks',
                       page_route:'/api/admin/block/getall',
                       action:'Viewing all blocks in the list'
                   });
                    /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
                if(blocks){
                    return res.status(200).json({
                        error : false,
                        message: "Blocks acquired successfully",
                        data : blocks
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable to fetch Blocks",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Blocks",
                    error_description: e.toString(),
                    route: "/api/admin/block/getall",
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

      /* --------------------------- GET page BY PARAMS -------------------------- */
      static async getBlockbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var blockparams = await Block.findAll({
            limit:limit,
            offset:offset
        });
         /* ---------------------------------- page ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View blocks by offset and limit',
          page_route:'/api/admin/block/getallparams',
          action:'Viewing sets of blocks in the list '
      });
       /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

        if(blockparams){
            return res.status(200).json({
                error: false,
                message: 'Block acquired successfully',
                data: blockparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire block',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all blocks by paprams",
            error_description: e.toString(),
            route: "/api/admin/block/getallparams/:offset/:limit",
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

    /* --------------------- GET BLOCK BY ID ENDPOINT --------------------- */
    static async getBlockbyid(req,res){
        try{
        
        var blockid = await Block.findOne({where: {id : req.params.id}});
            /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View block by id',
          page_route:'/api/admin/block/:id',
          action:'Viewing block by id '
      });
       /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */

        if(blockid == null){
            return res.status(200).json({
                error:true,
                message: 'invalid block id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Block acquired successfully',
                data: blockid
                
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting block by id",
            error_description: e.toString(),
            route: "/api/admin/block/getbyid/:id",
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


    /* --------------------- GET BLOCK BY BLOCK ID ENDPOINT --------------------- */
    static async getBlockbyblockid(req,res){
        try{

        var theblockid = await Block.findOne({where: {block_id : req.params.block_id}});

      /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View block by block id',
          page_route:'/api/admin/block/getbyblockid/:block_id',
          action:'Viewing block by id '
      });
       /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */

        if(theblockid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid block id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'block acquired successfully',
                data: theblockid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting blockby blockid",
            error_description: e.toString(),
            route: "/api/admin/block/getbyblockid/:block_id",
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


    

    /* ---------------------- EDIT block BY ID END POINT ---------------------- */
    static async editBlockbyid(req, res){
        try{

            // const errors = validationResult(req);
  
            // if (!errors.isEmpty()) {
            // return res.status(400).json({
            //     errors:true,
            //     message: "All fields are required",
            //     data: {}
            //     });
            // }

        var editBlock = await Block.update({
            block_name : req.body.block_name.trim(),
            block_description : req.body.block_description.trim(),
            block_content : req.body.block_content.trim(),
            page_id : req.body.page_id.trim(),
            priority:req.body.priority.trim(),
            
        }, { where : {id : req.body.id } });


            /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit Block',
              page_route:'/api/admin/block/edit',
              action:'Updating block information '
          });
           /* ---------------------------------- BLOCK ACTIVITY LOG --------------------------------- */
    


        if(editBlock){
            return res.status(200).json({
                error : false,
                message : "Block edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit block",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting block by id",
            error_description: e.toString(),
            route: "/api/admin/block/edit",
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
    static async deleteBlockbyid(req, res){
        try{

        var delBlockid = await Block.destroy({ where : {id : req.params.id}});

         /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */
         var adminId = await  serveAdminid.getTheId(req);

         await Activitylog.create({
           admin_id:adminId ,
           section_accessed:'Delete block',
           page_route:'/api/admin/block/delete/:id',
           action:'Deleting block information '
       });
        /* ---------------------------------- PAGE ACTIVITY LOG --------------------------------- */

        if(delBlockid == null){
            return res.status(200).json({
                error : true,
                message : "Invalid block id",
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Block deleted successfully",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Block by id",
            error_description: e.toString(),
            route: "/api/admin/block/delete/:id",
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

module.exports = BlockController;

    