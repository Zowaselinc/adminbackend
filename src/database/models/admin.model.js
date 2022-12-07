const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        admin_id : {
            type: Sequelize.STRING

        },
        first_name : {
            type: Sequelize.STRING
        },
        last_name : {
            type : Sequelize.STRING
        },
        email : {
            type : Sequelize.STRING,
            allowNull : false
        },
        password : {
            type : Sequelize.STRING
        },
        phone : {
            type : Sequelize.STRING
        },
        role : {
            type : Sequelize.STRING
        },
        recovery_phrase : {
            type : Sequelize.STRING
        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("admins", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Admin = instance.define("admins", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return Admin;
}

module.exports = { Schema , Model};