



const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
       admin: {
            type: Sequelize.STRING
        },
        subject : {
            type: Sequelize.STRING
        },
        message_id: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.TEXT
        },
        contact: {
            type: Sequelize.STRING
        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("sms", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Sms = instance.define("sms", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Sms;
}

module.exports = { Schema , Model};