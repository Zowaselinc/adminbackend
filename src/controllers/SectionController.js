
const { request } = require("express");
const { validationResult } = require("express-validator");
const { Section, ErrorLog , Activitylog} = require("~database/models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5ODE5NTQwLCJleHAiOjE2Njk5OTIzNDB9.6nuXTimj8kSSxxq7PvP6cg9vkOuysZPEWjRay9_zXWs
const serveAdminid = require("~utilities/serveAdminId");
class SectionController{
/* ----------------------- CREATE/ADD SECTION END POINT ----------------------- */
    static async createSection(req, res){
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


            const sectionid = crypto.randomBytes(16).toString("hex");
           
            var confirmSection = await Section.findOne(
                {
                    where: {
                        section_name: req.body.section_name
                    }
                }
            );

            if(confirmSection){
                return res.status(200).json({
                    error : true,
                    message : "Section Name already exist"

                });
            }else{
               
                var section = await Section.create({
                    section_id :"ZWLSEC"+sectionid,
                    section_name : req.body.section_name,
                    section_description : req.body.section_description,
                   
                });
                        
                          /* ----------------------------------  ACTIVITY LOG --------------------------------- */

                          await Activitylog.create({
                            admin_id:adminId ,
                            section_accessed:'Adding new section',
                            page_route:'/api/admin/section/add',
                            action:'Added new section'
                        });
                         /* ----------------------------------  ACTIVITY LOG --------------------------------- */

                        if(section){
                            return res.status(200).json({
                                error : false,
                                 message : "Section created succesfully"

                             });
                        }else{
                            return res.status(200).json({
                                error : true,
                                message : "Failed to create section"
            
                            });
    
                }
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating section",
                error_description: e.toString(),
                route: "/api/admin/section/add",
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


/* ------------------------ GET ALL SECTIONS END POINT ------------------------ */
            static async getAllSections(req, res){
          
                try{

                var thesection = await Section.findAll({req});
                   /* ----------------------------------  ACTIVITY LOG --------------------------------- */
                   var adminId = await  serveAdminid.getTheId(req);
                   await Activitylog.create({
                       admin_id:adminId ,
                       section_accessed:'View All Sections',
                       page_route:'/api/admin/section/getall',
                       action:'Viewing all sections in the list'
                   });
                    /* ----------------------------------  ACTIVITY LOG --------------------------------- */
                if(thesection){
                    return res.status(200).json({
                        error : false,
                        message: "Sections acquired successfully",
                        data : thesection
                    });

                }else{
                    return res.status(200).json({
                        error : true,
                        message: "Unable acquire sections",
                    });

                }

            }catch(e){
                var logError = await ErrorLog.create({
                    error_name: "Error on getting all Sections",
                    error_description: e.toString(),
                    route: "/api/admin/section/getall",
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

      /* --------------------------- GET SECTIONS BY PARAMS -------------------------- */
      static async getsectionbyparams(req,res){
        try{
            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
       
        var sectionparams = await Section.findAll({
            limit:limit,
            offset:offset
        });
         /* ----------------------------------  ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View sections by offset and limit',
          page_route:'/api/admin/section/getallparams',
          action:'Viewing sets of sections in the list '
      });
       /* ----------------------------------  ACTIVITY LOG --------------------------------- */

        if(sectionparams){
            return res.status(200).json({
                error: false,
                message: 'Sections acquired successfully',
                data: sectionparams
            })
        }else{
            return res.status(200).json({
                error: true,
                message: 'Failed to acquire Section',
               
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting all Sections by paprams",
            error_description: e.toString(),
            route: "/api/admin/section/getallparams/:offset/:limit",
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

    /* --------------------- GET SECTION BY ID ENDPOINT --------------------- */
    static async getsectionbyid(req,res){
        try{

        var sectionid = await Section.findOne({where: {id : req.params.id}});

      /* ----------------------------------  ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View section by id',
          page_route:'/api/admin/section/getbyid/:id',
          action:'Viewing section by id '
      });
       /* ----------------------------------  ACTIVITY LOG --------------------------------- */


        if(sectionid == null){
            return res.status(200).json({
                error:true,
                message: 'id not found'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Section acquired successfully',
                data: sectionid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting Section by id",
            error_description: e.toString(),
            route: "/api/admin/section/getbyid/:id",
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


    /* --------------------- GET SECTION BY SECTION ID ENDPOINT --------------------- */
    static async getBysectionid(req,res){
        try{

        var thesectionid = await Section.findOne({where: {section_id : req.params.section_id}});

      /* ---------------------------------- ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'View section by section id',
          page_route:'/api/admin/section/getbysectionid/:section_id',
          action:'Viewing section by id '
      });
       /* ---------------------------------- ACTIVITY LOG --------------------------------- */

        if(thesectionid == null){
            return res.status(200).json({
                error:true,
                message: 'Invalid section id'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Section acquired successfully',
                data: thesectionid
            })
        }
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on getting section by section id",
            error_description: e.toString(),
            route: "/api/admin/section/getbysectionid/:section_id",
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


    

    /* ---------------------- EDIT SECTION END POINT ---------------------- */
    static async editsectionbyid(req, res){
        try{

            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

        var editSection = await Section.update({
                section_name : req.body.section_name,
                section_description : req.body.section_description
        }, { where : { id : req.body.id } });


            /* ----------------------------------  ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
              admin_id:adminId ,
              section_accessed:'Edit Section',
              page_route:'/api/admin/section/edit',
              action:'Updating section information '
          });
           /* ----------------------------------  ACTIVITY LOG --------------------------------- */
    


        if(editSection){
            return res.status(200).json({
                error : false,
                message : "Section edited succesfully",
                
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to edit section",
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting section",
            error_description: e.toString(),
            route: "/api/admin/section/edit/:id",
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
    

    /* ------------------------ DELETE SECTION  ------------------------ */
    static async deletesection(req, res){
        try{


        /* ----------------------------------  ACTIVITY LOG --------------------------------- */
        var adminId = await  serveAdminid.getTheId(req);

        await Activitylog.create({
          admin_id:adminId ,
          section_accessed:'Delete Section',
          page_route:'/api/admin/section/delete/:id',
          action:'Deleted a section'
      });
       /* ----------------------------------  ACTIVITY LOG --------------------------------- */

       var delsection = await Section.destroy({ where : {id : req.params.id}});

        if(delsection){
            return res.status(200).json({
                error : false,
                message : "Section deleted succesfully",
            })
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete Section",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Section",
            error_description: e.toString(),
            route: "/api/admin/section/delete/:id",
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

module.exports = SectionController;

    