
const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        role_id: {
            type: Sequelize.STRING,
            allowNull: false

        },
        role_name : {
            type: Sequelize.STRING,
            allowNull : false

        },
        role_description : {
            type: Sequelize.TEXT,
            allowNull : false
        },
        section : {
            type: Sequelize.STRING,
            allowNull : false
        },

        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("role", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Role = instance.define("role", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Role;
}

module.exports = { Schema , Model};