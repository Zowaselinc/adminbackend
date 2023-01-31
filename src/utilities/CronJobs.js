const CronJob = require("node-cron");
var cache = require('memory-cache');
const { mydb } = require("~utilities/backupdriver");


exports.initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule('* * * * *', async () => {
    console.log("I'm executed on a schedule!");
    // Add your custom logic here
      let users = await mydb.select("users");
      let crops = await mydb.select("crops");
        await cache.put("users", JSON.stringify(users));
        await cache.put("crops", JSON.stringify(crops));
      
       
  });

  scheduledJobFunction.start();
}