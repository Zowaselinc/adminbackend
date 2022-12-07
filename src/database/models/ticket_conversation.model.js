



const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        ticket_id: {
            type: Sequelize.STRING
        },
        conversation_id : {
            type: Sequelize.STRING
        },
        sender_id: {
            type: Sequelize.STRING
        },
        sender_type: {
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
    sequelize.define("ticket_conversations", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const TicketConversation = instance.define("ticket_conversations", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return TicketConversation;
}

module.exports = { Schema , Model};