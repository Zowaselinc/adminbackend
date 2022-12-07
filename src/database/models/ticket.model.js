


const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        ticket_id: {
            type: Sequelize.STRING
        },
        user_id : {
            type: Sequelize.STRING
        },
        subject: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        priority: {
            type: Sequelize.INTEGER
        },
        admin_assigned: {
            type: Sequelize.STRING
        },
        ticket_status: {
            type: Sequelize.INTEGER
        },
        
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("tickets", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Ticket = instance.define("tickets", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Ticket;
}

module.exports = { Schema , Model};