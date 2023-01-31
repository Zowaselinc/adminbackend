
const express = require('express');

const App = express();

const Routes = require('~routes');

const {DB} = require("~database/models");

const cors = require('cors');
const scheduledFunctions = require("~utilities/CronJobs");
class Server{

    static boot(port=3400){

        App.use(cors({
            origin: '*',
            methods: ['GET','POST']
        }));

        // Register App Routes
        Routes(App).register();
        
    // ADD CALL to execute your function(s)
    scheduledFunctions.initScheduledJobs();


        //Sync Database Models
        //{ force: true }
        DB.sequelize.sync()
        .then(() => {
            console.log("Synced db.");
        })
        .catch((err) => {
            console.log("Failed to sync db: " + err.message);
        });

        App.listen(port, () => {
            console.log(`Admin app listening on port ${port}`)
        })
    }
    
}

module.exports = Server;
