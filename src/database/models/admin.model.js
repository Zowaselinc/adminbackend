const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        admin_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        first_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name : {
            type : Sequelize.STRING,
            allowNull: false
        },
        email : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        password : {
            type : Sequelize.STRING,
            allowNull : false
        },
        phone : {
            type : Sequelize.STRING
        },
        role_id : {
            type : Sequelize.STRING
        },
        role_name : {
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