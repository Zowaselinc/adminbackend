



const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        message_id: {
            type: Sequelize.STRING
        },
        sender_id : {
            type: Sequelize.STRING
        },
        receiver_id: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.TEXT
        },
        message_type: {
            type: Sequelize.STRING
        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("messages", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Message = instance.define("messages", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Message;
}

module.exports = { Schema , Model};