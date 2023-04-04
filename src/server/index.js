
const express = require('express');
const App = express();



     /* ---------------------------------------------------- STEP ONE ---------------------------------------------------- */
/* ------------- CREATE A SEPARATE NODE HTTP SERVER DIFFERENT FROM EXPRESS AND ATTACH App aboce into it ------------- */
const http = require ('http').Server(App)


/* ---------------------------------------------------- STEP TWO ---------------------------------------------------- */
/* ------------------------------------- INSTALL SOCKET IO NPM   npm i socket.io ------------------------------------ */


/* --------------------------------------------------- STEP THREE --------------------------------------------------- */
/* -------------------------------------------- CREATE SOCKET IO INSTANCE ------------------------------------------- */

const Routes = require('~routes');

const {DB} = require("~database/models");

const cors = require('cors');
const scheduledFunctions = require("~utilities/CronJobs");



/* --------------------------------------------- ESTABLISH IO ON SOCKETS -------------------------------------------- */
const io  = require('socket.io')(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
    
});

/* --------------------------------------- SEND IO OBJECT TO ANOTHER SERVICES --------------------------------------- */
const MeshSockets = require('~services/sockets');
MeshSockets(io);



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

 /* ---------------------------------------------------- STEP FIVE --------------------------------------------------- */
  //change app.listen to http .listen because of socket io
        // App.listen(port, () => {
        //     console.log(`Admin app listening on port ${port}`)
        // })
        http.use(cors({
            origin: '*',
            methods: ['GET','POST']
        }));
        http.listen(port, () => {
            console.log(`Admin app listening on port ${port}`)
        })
    }
    
}

module.exports = Server;
