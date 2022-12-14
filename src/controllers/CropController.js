//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Crop, CropSpecification, CropRequest, ErrorLog, Activitylog, Category, User, Auction } = require('~database/models');
// const { uploads } = require('~cropimageupload');
const serveAdminid = require("~utilities/serveAdminId");



class CropController{

    /* ---------------------------- * ADD Cropdescription * ---------------------------- */
    static async add(req , res){

        // return res.status(200).json({
        //     message : "Add Cropdescription "
        // });

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        // let allImages = Object.keys(req.files);
        // console.log(__dirname + '/uploads/' + req.files[allImages[0]].name);
        try{

            if(!errors.isEmpty()){
                // return res.status(400).json({ errors: errors.array() });
                return res.status(200).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": errors
                }) 
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(200).json({
                    "error": true,
                    "message": "No files were uploaded."
                }) 
            
            }else{
                // console.log(req.files);

                // console.log('req.files >>>', req.files); // eslint-disable-line
                
                
                let allImages = Object.keys(req.files);
                
                // let theurlpath = Object.keys("http://localhost:3000/"+req.files);
                // console.log(allImages, "THE IMAGES HIUGUFTYDFGHJKHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
                let my_object = [];
                for(let i = 0; i < allImages.length; i++ ){
                    
                    my_object.push(req.files[allImages[i]].name);
                    sampleFile = req.files[allImages[i]];
                    uploadPath = __dirname + '/uploads/' + req.files[allImages[i]].name;

                    sampleFile.mv(uploadPath, function(err) {
                        if (err){
                            return res.status(500).send(err+" Error in uploading file");
                        }else{
                            
                            // res.send('File uploaded!');

                            // image = "image"+i;
                            // my_object.image = "uploadPath"
                        }
                    });
                }
                // res.send(my_object);

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */



                /* ------------------------ INSERT INTO CROP TABLE ----------------------- */
               
                var crop = await Crop.create({
                    user_id: req.body.user_id,
                    title: req.body.title,
                    type: req.body.type,
                    category_id: req.body.category_id,
                    subcategory_id: req.body.subcategory_id,
                    active: 0,
                    market: "crop",
                    description: req.body.description,
                    images: my_object.toString(),
                    currency: req.body.currency,
                    is_negotiable: req.body.is_negotiable,
                    video: req.body.video,
                    packaging: req.body.packaging,
                    application: req.body.application,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    expiration_date: req.body.expiration_date
                })
                
                /* ------------------------ INSERT INTO CROP TABLE ----------------------- */


                if(crop){

                    var createCropSpecification = await CropSpecification.create({
                        model_id: crop.id,
                        model_type: req.body.model_type,
                        qty: req.body.qty,
                        price: req.body.price,
                        color: req.body.color,
                        moisture: req.body.moisture,
                        foreign_matter: req.body.foreign_matter,
                        broken_grains: req.body.broken_grains,
                        weevil: req.body.weevil,
                        dk: req.body.dk,
                        rotten_shriveled: req.body.rotten_shriveled,
                        test_weight: req.body.test_weight,
                        hectoliter: req.body.hectoliter,
                        hardness: req.body.hardness,
                        splits: req.body.splits,
                        oil_content: req.body.oil_content,
                        infestation: req.body.infestation,
                        grain_size: req.body.grain_size,
                        total_defects: req.body.total_defects,
                        dockage: req.body.dockage,
                        ash_content: req.body.ash_content,
                        acid_ash: req.body.acid_ash,
                        volatile: req.body.volatile,
                        mold: req.body.mold,
                        drying_process: req.body.drying_process,
                        dead_insect: req.body.dead_insect,
                        mammalian: req.body.mammalian,
                        infested_by_weight: req.body.infested_by_weight,
                        curcumin_content: req.body.curcumin_content,
                        extraneous: req.body.extraneous,
                        unit: req.body.unit,
                        liters: req.body.liters
                    })




                    if(createCropSpecification){
                        var createCroropRequest = await CropRequest.create({
                            crop_id: crop.id,
                            state: req.body.state,
                            zip: req.body.zip,
                            country: req.body.country,
                            address: req.body.address,
                            delivery_method: req.body.delivery_method,
                            delivery_date: req.body.delivery_date,
                            delivery_window: req.body.delivery_window
                        })

                        return res.status(200).json({
                            "error": false,
                            "message": "Crop created successfully",
                            // "product": product, Cropspec, ProdRequest
                        })
                    }

                }
  
            
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on add a crop",
                error_description: e.toString(),
                route: "/api/crop/add",
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
    // /* ---------------------------- * ADD Cropdescription * ---------------------------- */
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */
    static async getByCropWanted(req , res){

        // return res.status(200).json({
        //     message : "GET Wanted Crops"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var findWantedCrops = await Crop.findAndCountAll({ 
                include: [{
                    model: CropSpecification,
                    as: 'specification',
                },
                {
                    model: CropRequest,
                    as: 'crop_request',
                },
                {
                    model : Category,
                    as : "category"
                },
                {
                    model : User,
                    as : 'user',
                }],
                where: { type: "wanted" },
                order: [['id', 'DESC']]
            });

        
            /* --------------------- If fetched the Wanted Crops --------------------- */
            
            return res.status(200).json({
                error : false,
                message : "Crops wanted grabbed successfully",
                data : findWantedCrops
            })
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: e.toString(),
                route: "/api/crop/getbycropwanted",
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
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */




    /* --------------------------- GET ALL AUCTION CROPS --------------------------- */
    static async getByCropAuctions(req , res){

        try{
            var findCropAuctions = await Crop.findAndCountAll({ 
                include: [{
                    model: CropSpecification,
                    as: 'specification',
                },
                {
                    model : Category,
                    as : "category"
                },
                {
                    model : User,
                    as : 'user',
                },
                {
                    model : Auction,
                    as : "auction"
                }],
                
                where: { type: "auction" },
                order: [['id', 'DESC']]
            });

        
            /* --------------------- If fetched the Wanted Crops --------------------- */
            
            return res.status(200).json({
                error : false,
                message : "Crops auctions grabbed successfully",
                data : findCropAuctions
            })
            
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: error.toString(),
                route: "/api/crop/getbycropauction",
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
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */






    /* --------------------------- GET ALL OFFERED CROPS --------------------------- */
    static async getByCropOffer(req , res){

        try{
            
            const { count, rows } = await Crop.findAndCountAll({ where: { type: "offer" } });

            if(count<1){
                return res.status(200).json({
                    error : true,
                    message : "No crop offer found",
                    data : []
                })
            }else{
                var findCropOffers = await Crop.findAndCountAll({ 
                    include: [{
                        model: CropSpecification,
                        as: 'specification',
                        where : { model_type : "crop"},
                    },
                    {
                        model : Category,
                        as : "category"
                    },
                    {
                        model : User,
                        as : 'user',
                    }],
                    where: { type: "offer" },
                    order: [['id', 'DESC']]
                });
    
            
                /* --------------------- If fetched the Wanted Crops --------------------- */
                
                return res.status(200).json({
                    error : false,
                    message : "Crops offer grabbed successfully",
                    data : findCropOffers
                })
            }
            
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crops offer",
                error_description: e.toString(),
                route: "/api/crop/getbycropoffer",
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
    /* --------------------------- GET ALL OFFERED CROPS --------------------------- */

    /* --------------------------- GET CROP BY ID --------------------------- */
    static async getById(req , res){


        try{
            const cropId = req.params.id;
    
            var crop = await Crop.findOne({ where: { id: cropId } });
            if(crop){

                var findCrop = await Crop.findOne({ 
                    include: [{
                        model: CropSpecification,
                        as: 'specification',
                    },
                    {
                        model : Category,
                        as : 'category'
                    },
                    {
                        model: CropRequest,
                        as: 'crop_request',
                        order: [['id', 'DESC']],
                        limit: 1,
                        
                    },{
                        model : User,
                        as : 'user'
                    }],
                    
                    where: { id: cropId },
                    order: [['id', 'DESC']]
                });
    
                return res.status(200).json({
                    error : false,
                    message : "Single crop grabbed successfully",
                    data : findCrop
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No such crop found",
                    data : []
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting single crop by id",
                error_description: e.toString(),
                route: "/api/crop/getbyid",
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
    /* --------------------------- GET CROP BY ID --------------------------- */
    
}

module.exports = CropController;
