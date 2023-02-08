const CronJob = require("node-cron");
var cache = require('memory-cache');
const { mydb } = require("~utilities/backupdriver");


exports.initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule('* * * * *', async () => {
    console.log("I'm executed on a schedule!");
    // Add your custom logic here
      let users = await mydb.select("users");
      let crops = await mydb.select("crops");
      let admins = await mydb.select("admins");
      let categories = await mydb.select("categories");
      let subcategories = await mydb.select("subcategories");
      
      
      let conversations = await mydb.select("conversations");
    

        await cache.put("users", JSON.stringify(users));
        await cache.put("crops", JSON.stringify(crops));
        await cache.put("admins",JSON.stringify(admins));
        let conversationlist=[];



        let allcrops =[];

        crops.forEach(element => {
          let singlecrop = element;
            let category =  categories.filter(x => x.id == element.category_id)[0];
            let subcategory =  subcategories.filter(x => x.id == element.subcategory_id)[0];
            /* ------------------------- GET ALL THE SINGLE CROP ------------------------ */
            singlecrop.category =category;
            singlecrop.subcategory = subcategory;
            allcrops.push(singlecrop);
        });

        await Promise.all( conversations.map(async (element) => {
          let users = JSON.parse(cache.get("users"));
         
          /* ------------------------ Get individual user data ------------------------ */
          let userone = users.filter(x => x.id == element.user_one)[0];
          let usertwo = users.filter(x => x.id == element.user_two)[0];
          let crop = allcrops.filter(x => x.id == element.crop_id)[0];
          let conversationobject = {
                    "conversationid":element.id,
                    "userone": userone,
                    "usertwo": usertwo,
                    "crop": crop,
                    "type": "negotiation"
                }
                conversationlist.push(conversationobject);
            }));

            await cache.put("conversations",JSON.stringify(conversationlist));
       
            










        });




        

  scheduledJobFunction.start();
}