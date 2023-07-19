const { request } = require("express");
const { Input, ErrorLog, Activitylog, Category, SubCategory, User } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class InputProducts{

    static async createInput(req , res){

      

        // const errors = validationResult(req);

        
        
        try{

            // if(!errors.isEmpty()){
            //     return res.status(400).json({
            //         "error": true,
            //         "message": "All fields are required",
            //         "data": []
            //     }) 
            // }



                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
               
                var input = await Input.create({
                    user_id: req.body.user_id,
                    category_id: req.body.category_id,
                    subcategory_id: req.body.subcategory_id,
                    product_type: req.body.product_type,
                    crop_focus: req.body.crop_focus,
                    packaging: req.body.packaging,
                    description: req.body.description,
                    stock:req.body.stock,
                    usage_instruction: req.body.usage_instruction,
                    kilograms: req.body.kilograms,
                    grams: req.body. grams,
                    liters: req.body.liters,
                    pieces_carton: req.body.pieces_carton,
                    price: req.body.price,
                    images: JSON.stringify(req.body.images),
                    currency: req.body.currency,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    delivery_method: req.body.delivery_method,
                    expiry_date: req.body.expiry_date,
                    manufacture_country: req.body.manufacture_country,
                    video: req.body.video,
                    active: 1
                })
                
                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                  var adminId = await  serveAdminid.getTheId(req);

                  await Activitylog.create({
                      admin_id:adminId ,
                      section_accessed:'Add input',
                      page_route:'/api/admin/input/add',
                      action:'Added input'
                  });
                  /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
                if(input){

                    return res.status(200).json({
                        "error": false,
                        "message": "Input created successfully",
                        
                    });

                }else{
                    return res.status(200).json({
                        "error": true,
                        "message": "False failed to create input",
                        
                    });

                }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding an input",
                error_description: e.toString(),
                route: "/api/admin/input/add",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment ' + e.toString()
                })
            }  
        }

        
    }
       /* ------------------------ get all input by user id ------------------------ */
    static async getallInputsByUser(req , res){
        try{
            var alluserinputs = await Input.findAll({
                where: {
                    user_id: req.params.user_id
                },
                include:[
                    
                    {
                    model: Category,
                    as : "category"

                },
                {
                    model : SubCategory,
                    as : "subcategory"
                },
                {
                    model : User,
                    as : "user"
                }
            ],
            });
             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
             var adminId = await  serveAdminid.getTheId(req);

             await Activitylog.create({
                 admin_id:adminId ,
                 section_accessed:'View all input',
                 page_route:'/api/admin/input/getallbyuser',
                 action:'Viewed all input by user id'
             });
             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message: "User does not have an input product",
                   
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all user Inputs",
                error_description: e.toString(),
                route: "/api/input/getallbyuserid/:user_id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }


     /* -------------------------- get input by id ------------------------- */
     static async getInputsById(req , res){
        try{
            var inputid = await Input.findAll({
                where: {
                    id:req.params.id
                },

                include:[
                    
                    {
                    model: Category,
                    as : "category"

                },
                {
                    model : SubCategory,
                    as : "subcategory"
                },
                {
                    model : User,
                    as : "user"
                }
            ],
            
            });

            
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'View input by id',
                page_route:'/api/admin/input/getbyid/:id',
                action:'Viewing one input'
            });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(inputid.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "Input fetched successfully",
                    data : inputid
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found ",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting input by id",
                error_description: e.toString(),
                route: "/api/input/getbyid/:id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }

/* ----------------------------- get all inputs ----------------------------- */
    static async getallInputs(req , res){
        try{
            var alluserinputs = await Input.findAll({
                include:[
                    
                    {
                    model: Category,
                    as : "category"

                },
                {
                    model : SubCategory,
                    as : "subcategory"
                },
                {
                    model : User,
                    as : "user"
                }
            ],
            });
            
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'View all input',
                page_route:'/api/admin/input/getallbyuser',
                action:'Viewing all inputs in the list'
            });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found",
                    
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs",
                error_description: e.toString(),
                route: "/api/input/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
        /* -------------------------- get input by category ------------------------- */
    static async getallInputsByCategory(req , res){
        try{
            var allInputs = await Input.findAll({
                where: {
                    category_id:req.params.category_id
                }
            });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'View all input category',
                page_route:'/api/admin/input/getallbycategory/:category_id',
                action:'Viewing all inputs in the list'
            });
            /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this input type returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found for this input type",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by category",
                error_description: e.toString(),
                route: "/api/input/getallbycategory/:category",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
    /* ------------------------ Get input by manufacturer ----------------------- */
    static async getallInputsByManufacturer(req , res){
        try{
            var allInputs = await Input.findAll({
                where: {
                    manufacture_name: req.params.manufacturer
                }
            });

               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);

               await Activitylog.create({
                   admin_id:adminId ,
                   section_accessed:'View all input ',
                   page_route:'/api/admin/input/getallbymanufacturer/:manufacturer',
                   action:'Viewing all inputs by manufacturer'
               });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this manufacturer returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found for this manufacturer",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by manfacturer",
                error_description: e.toString(),
                route: "/api/input/getallbymanfacturer/:manfacturer",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }

    /* ------------------------- get input by packaging ------------------------- */
    static async getallInputsByPackaging(req , res){
        try{
            var allInputs = await Input.findAll({
                where: {
                    packaging: req.params.packaging
                }
            });

               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
               var adminId = await  serveAdminid.getTheId(req);

               await Activitylog.create({
                   admin_id:adminId ,
                   section_accessed:'View all input',
                   page_route:'/api/admin/input/getallbypackaging/:packaging',
                   action:'Viewing input by packaging'
               });
               /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */

            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this packaging returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message: "No input products found for this packaging",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by packaging",
                error_description: e.toString(),
                route: "/api/input/getallbypackaging/:packaging",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
   
}

module.exports = InputProducts;
