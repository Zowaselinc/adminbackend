const { request } = require("express");
const { validationResult } = require("express-validator");
const { Admin, ErrorLog , Activitylog, Role, Gallery} = require("~database/models");

const serveAdminid = require("~utilities/serveAdminId");

const { uuid } = require('uuidv4');
const  fs  = require("fs");




class GalleryContoller{
    /* -------------------------- // image file upload -------------------------- */

   static async uploadImg(req, res){
    try{


        if(req.files){
       }
    //    console.log(req.files)
       var file = req.files.file
       var filename = file.name
       console.log(filename);
       //all express static files go to public , they can be accessed without public on the url
       let filepath =`public`;
       //direct path to access files after upload
       
       
    //    Re-edit the subfilepath to avoid duplicate files of same name
        let subfilepath= `/email/${uuid()}${filename}`;

    //    combine general path with actual folder where the file is saved 
       let mainfilepath= filepath+subfilepath;

       //move file to required folder
       file.mv(mainfilepath, function(err){
        
        if(err){
            return res.status(400).json({
                error:true,
                message: "failed to upload file"
                
                
            });
            
        }else{
            return res.status(200).json({
                error:false,
                message:"file uploaded",
                file: subfilepath
            })
        }
       

       });
    //    insert uploade files into gallery table 
       await Gallery.create({
        image_id:uuid(),
        image_path:subfilepath
            
       })
    //    console.log(filepath);
    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on  uploading newsletter image",
            error_description: error.toString(),
            route: "/api/admin/gallery/uploadimg",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+ "" + error.toString(),
                
            });
    }

    }
    }
    /* --------------------- file upload endpoint ends here --------------------- */

                                // ***********************

    /* -------------------- delete file end point starts here ------------------- */
static async deleteFile(req,res){
   
    // supply the file name 
    const imagename = req.body.image_path;

    // check if the file name is provided 
    
    if(!imagename){
        return res.json({message:"imagename mandatory"})
    }
   
        // locate the image and the file where the image or file to be deleted is located 
    const rootfolder = "public/email"

    // the file path 
    const filepath = `${rootfolder}/${imagename}`
    
    try{
       
        // delete file from the filepath, which comprises of the folder and file where the image or file to be deleted is located 
        fs.unlink(filepath,(err)=>{
            
            if(err){
                
               console.log("Failed to delete file ",err)
               
             }else{
                return res.json({message:"File deleted successfully"
                })
             } 
             
        });
        // delete file from the db 
       await Gallery.destroy({where:{image_id:req.body.image_id}});
        
    }catch(err){
        var logError = await ErrorLog.create({
                    error_name: "Error on deletimg uploaded file",
                    error_description: err.toString(),
                    route: "/api/admin/gallery/deletefile/:image_path",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment'+ "" + err.toString(),
                        
                        });
                }
        }

        }
// end 


}

module.exports = GalleryContoller;

    