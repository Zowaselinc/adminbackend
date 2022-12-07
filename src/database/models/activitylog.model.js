


const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        admin_id : {
            type: Sequelize.STRING
        },
        section_accessed : {
            type: Sequelize.STRING

        },
        page_route: {
            type: Sequelize.STRING

        },
        action: {
            type: Sequelize.STRING

        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("activitylogs", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Activitylog = instance.define("activitylogs", Schema(Sequelize,2),{ 
        timestamps: false,
       
    });
    return Activitylog;
}

module.exports = { Schema , Model};