const MeshSockets=(io)=>{
  
   /* --------------------------------------------- LISTEN FOR A CONNECTION -------------------------------------------- */
    io.on("connection",function(socket){
        /* ----------------------------------- if a connection from front end has occured ----------------------------------- */
    socket.emit("connect","Chima you are connected in real-time");
    
    
    
    






    
    /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
    socket.on("batchupload",function(data){
        console.log(data);

    })
     /* ------------------------ EVERYTHING THAT COMES FROM THE FRONT END IS RECEIVED INSIDE HERE ------------------------ */
   












     /* ----------------------------- IF SOMEONE DISCONNECTS FROM THE SOCKET IT ALSO SHOWS UP ---------------------------- */
     socket.on("disconnect",function(){
        console.log("someone disconnected");
     })

    })
    
   
    






}

module.exports=MeshSockets;