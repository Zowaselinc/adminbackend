const { mydb } = require("~utilities/backupdriver");


const MeshSockets=(io)=>{
  
   /* --------------------------------------------- LISTEN FOR A CONNECTION -------------------------------------------- */
    io.on("connection",function(socket){
        /* ----------------------------------- if a connection from front end has occured ----------------------------------- */
    socket.emit("isconnected","Chima you are connected in real-time");
    


    
    /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
    socket.on("batchupload",function(data){
       
        


        /* --------------------------------------------- SEND BACK WHAT HE SENT --------------------------------------------- */
        
        
        socket.emit("batchresponse",data);

    })
     /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
   
  











     /* ----------------------------- IF SOMEONE DISCONNECTS FROM THE SOCKET IT ALSO SHOWS UP ---------------------------- */
     socket.on("disconnect",function(){
        console.log("someone disconnected");
     })

    })
    
   
    






}

module.exports=MeshSockets;