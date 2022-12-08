



const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        notification_id: {
            type: Sequelize.STRING
        },
        notification_title : {
            type: Sequelize.STRING
        },
        notify_description: {
            type: Sequelize.TEXT
        },
        notification_type: {
            type: Sequelize.STRING
        },
        notification_status: {
            type: Sequelize.INTEGER
        },
        admin_id: {
            type: Sequelize.STRING
        }, 
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("admin_notifications", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const AdminNotification = instance.define("admin_notifications", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return AdminNotification;
}

module.exports = { Schema , Model};