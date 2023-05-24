//Import validation result
const { validationResult } = require('express-validator');
const { Category, ErrorLog, SubCategory, Crop, Input } = require('~database/models');
const crypto = require('crypto');
const { count } = require('console');
const { Sequelize } = require('sequelize');
const jwt = require("jsonwebtoken");
const serveAdminid = require("~utilities/serveAdminId");

class CategoryController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Category"
        });
    }

    /* ----------------------- CREATE CATEGORY END POINT ----------------------- */
    static async createCategory(req, res){
        try{
           
           
           
               
                var category = await Category.create({
                   name:req.body.name,
                   type:req.body.type
                   
                });
                        
                    

                        if(category){
                            return res.status(200).json({
                                error : false,
                                 message : "Category created succesfully"

                             });
                        }else{
                            return res.status(200).json({
                                error : true,
                                message : "Failed to create category"
            
                            });
    
                }
            

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on creating category",
                error_description: error.toString(),
                route: "/api/admin/crop/category/add",
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
    /* --------------------------ADD CATEGORY------------------------------------------------ */


    /* --------------------------- GET ALL CATEGORIES --------------------------- */


    static async getAllCategories(req, res){

        try{

            var countOptions = {
                // attributes: { 
                //     include: [[Sequelize.fn("COUNT", Sequelize.col(`${req.params.type}s.id`)), `count`]] 
                // },
                include: [{
                    model: req.params.type == "crop" ? Crop : Input,
                    attributes: []
                }],
                group: ['id']
                
            };

            var categories = await Category.findAll({
                where: {
                    type: req.params.type
                },
                ...countOptions
            });

            if(categories.length > 0){
``    
                return res.status(200).json({
                    error : false,
                    message: "Categories returned successfully",
                    data : categories
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message: "No categories found",
                    data : []
                })

            }

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Categories",
                error_description: error.toString(),
                route: `/category/${req.params.type}/getall`,
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment" + error.toString(),
                data: []
            });
        }


    }

    /* --------------------------- GET ALL CATEGORIES --------------------------- */
    
    


    /* --------------------------- GET ALL CATEGORIES BY LIMIT --------------------------- */
    static async getAllByLimit(req , res){


        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);

        try{
            var categories = await Category.findAll({ 
                offset: offset, 
                limit: limit,
                where : {
                    type : req.params.type
                }
            });

            return res.status(200).json({
                error : false,
                data : categories
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all categories by limit and offset",
                error_description: e.toString(),
                route: "/api/crop/category/getall/:offset/:limit",
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
    /* --------------------------- GET ALL CATEGORIES BY LIMIT --------------------------- */





    /* --------------------------- GET CATEGORIES BY CATEGORY ID --------------------------- */
    static async getById(req , res){

        try{
            var category = await Category.findOne({ where: { id: req.params.id } });
            if(category){
                return res.status(200).json({
                    error : false,
                    message : "Category grabbed successfully",
                    category : category
                })
            }else{
                return res.status(400).json({
                    error : false,
                    message : "No category found",
                    category : category
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all categories by id",
                error_description: e.toString(),
                route: "/api/admin/crop/category/getbyid",
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
    /* --------------------------- GET CATEGORIES BY CATEGORY ID --------------------------- */

    /* --------------------------- EDIT CATEGORY BY ID -------------------------- */
    static async editCategory(req, res){
        try{
            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

        var editcategory = await Category.update({
            name:req.body.name,

        }, { where : {id : req.body.id } });

        if(editcategory){
            return res.status(200).json({
                error : false,
                message : "Category edited succesfully",
                data : editcategory
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Failed to edit category",
               
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting category by id",
            error_description: e.toString(),
            route: "/api/admin/category/edit",
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
    /* ----------------------------------- END ---------------------------------- */

    /* ------------------ DELETE CATEGORY / SUB-CATEGORY BY ID ------------------ */


    static async deleteCategory(req, res){
        try{

       var delCategory = await Category.destroy({ where : {id:req.params.id}});

        if(delCategory){
            /* --------------------------- delete subcategory alongside category --------------------------- */
            var delsubCategory = await SubCategory.destroy({ where : {category_id:req.params.id}});

            if(delsubCategory){
                return res.status(200).json({
                    error : false,
                    message : "Category deleted succesfully",
                })
            }
        }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete Category",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Category by id",
            error_description: e.toString(),
            route: "/api/admin/crop/category",
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


    /* ------------------ DELETE CATEGORY / SUB-CATEGORY BY ID ------------------ */


}

module.exports = CategoryController;
