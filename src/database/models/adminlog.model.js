
const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        admin_id : {
            type: Sequelize.STRING
        },
        device_info : {
            type: Sequelize.STRING

        },
        ip_address: {
            type: Sequelize.STRING

        },
        location: {
            type: Sequelize.STRING

        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("adminlogs", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Adminlog = instance.define("adminlogs", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Adminlog;
}

module.exports = { Schema , Model};