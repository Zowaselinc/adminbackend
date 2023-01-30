//Import validation result
const { validationResult } = require('express-validator');
const { SubCategory, ErrorLog } = require('~database/models');
const crypto = require('crypto');

class SubCategoryController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello SubCategory"
        });
    }


    /* ---------------------------- * ADD SUBCATEGORY * ---------------------------- */
    static async createSubcategory(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() });
            }
    

            const checkSubCategory = await SubCategory.findOne({ 
                where: { category_id: req.body.category_id, name:req.body.subcategory_name } 
            });


            if(checkSubCategory){
                return res.status(200).json({
                    "error": true,
                    "message": "Subcategory already exist"
                })
            }else{
                var subcategory = await SubCategory.create({
                    category_id: req.body.category_id,
                    name: req.body.subcategory_name,
                    type: req.body.type
                });
                
                if(subcategory){

                    return res.status(200).json({
                        "error": false,
                        "message": "Subcategory created successfully",
                       
                    });
                }else{
                    return res.status(200).json({
                        error : true,
                        message : "Failed to create sub_category"
    
                    });
                }
            }
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding a subcategory",
                error_description: e.toString(),
                route: "/api/crop/subcategory/add",
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
    /* ---------------------------- * ADD SUBCATEGORY * ---------------------------- */










    /* --------------------------- GET SUBCATEGORIES BY CATEGORY --------------------------- */
    static async getByCategory(req , res){

        const subcategoryLimit = req.query.limit ? Number(req.query.limit) : null;
        const subcategoryOffset = req.query.offset ? Number(req.query.offset) : null;

        var filterOptions = {};

        if(subcategoryLimit && !isNaN(subcategoryLimit)){
            filterOptions.limit = subcategoryLimit;
        }
        if(subcategoryOffset && !isNaN(subcategoryOffset)){
            filterOptions.offset = subcategoryOffset
        }


        try{
            const { count, rows } = await SubCategory.findAndCountAll({ 
                where: { category_id: req.params.categoryId },
                ...filterOptions
            });

            if(count < 1){
                return res.status(200).json({
                    "error": true,
                    "message": "No Subcategory found"
                })
            }else{
                return res.status(200).json({
                    "error" : false,
                    "message": "Subcategories grabbed successfully",
                    "data" : rows
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting subcategory from category id",
                error_description: e.toString(),
                route: "/api/crop/subcategory/getbycategory",
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
    /* --------------------------- GET SUBCATEGORIES BY CATEGORY --------------------------- */








    /* --------------------------- GET ONE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */
    static async getById(req , res){
        try{
            var subcategory = await SubCategory.findOne({ where: { id: req.params.id } });
            if(subcategory){
                return res.status(200).json({
                    error : false,
                    message : "Single subcategory grabbed successfully",
                    subcategory : subcategory
                })
            }else{
                return res.status(200).json({
                    error : true,
                    message : "No subcategory found",
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting subcategory by id",
                error_description: e.toString(),
                route: "/api/crop/subcategory/getbyid",
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
    /* --------------------------- GET ONE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */


    static async getSubCategoriesLimit(req, res){
        try{
            /* ----------- get the offset and limit and convert to Number type ---------- */
            const subcategoryLimit = Number(req.params.limit);
            const subcategoryOffset = Number(req.params.offset);

            if(!isNaN(subcategoryLimit) && !isNaN(subcategoryOffset)){

                var subcategories = await Subcategory.findAll({
                    where: {
                        category_id: req.params.categoryId
                    },
                    limit: subcategoryLimit,
                    offset: subcategoryOffset
                });
                
                if(subcategories.length > 0){

                    return res.status(200).json({
                        error : false,
                        message: "SubCategories retrieved successfully",
                        data :subcategories
                    })

                }else{

                    return res.status(200).json({
                        error : true,
                        message: "No subcategories found",
                        data :subcategories
                    })

                }

            }else{

                return res.status(200).json({
                    error : true,
                    message : "URL parameter provided is invalid",
                    data: []
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all specific categories",
                error_description: error.toString(),
                route: "/api/input/subcategory/getall/:id/:offset/:limit",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }
    /* ----------------------------------- END ---------------------------------- */

     /* --------------------------- EDIT CATEGORY BY ID -------------------------- */
     static async editSubcategory(req, res){
        try{
            const errors = validationResult(req);
  
            if (!errors.isEmpty()) {
            return res.status(400).json({
                errors:true,
                message: "All fields are required",
                data: {}
                });
            }

        var editsubcategory = await SubCategory.update({
            category_id: req.body.category_id,
            name: req.body.subcategory_name,
            type: req.body.type

        }, { where : {id : req.body.id } });

        if(editsubcategory){
            return res.status(200).json({
                error : false,
                message : "Sub_category edited succesfully",
                data : editsubcategory
            })
        }else{
            return res.status(200).json({
                error : false,
                message : "Failed to edit sub_category",
                
            })
        }
       
    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on editting sub_category by id",
            error_description: e.toString(),
            route: "/api/admin/subcategory/edit",
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

    /* ------------------ DELETE SUB_CATEGORY BY ID ------------------ */


    static async deleteSubCategory(req, res){
        try{

       var delSubcategory = await SubCategory.destroy({ where : {id:req.params.id}});
            if(delSubcategory){
                return res.status(200).json({
                    error : false,
                    message : "Sub-category deleted succesfully",
                })
            }else{
            return res.status(200).json({
                error : true,
                message : "Failed to delete Sub-category",
            })
        }

    }catch(e){
        var logError = await ErrorLog.create({
            error_name: "Error on deleting Sub-category by id",
            error_description: e.toString(),
            route: "/api/admin/subcategory/delete/:id",
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


    /* ------------------ DELETE SUB_CATEGORY BY ID ------------------ */


}

module.exports = SubCategoryController;
