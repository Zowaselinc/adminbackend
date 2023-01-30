
const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        role_id: {
            type: Sequelize.STRING

        },
        role_name : {
            type: Sequelize.STRING

        },
        role_description : {
            type: Sequelize.TEXT
        },
        section : {
            type: Sequelize.STRING
        },

        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("roles", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Role = instance.define("roles", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Role;
}

module.exports = { Schema , Model};