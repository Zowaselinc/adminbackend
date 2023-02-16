const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        page_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        page_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        page_description : {
            type : Sequelize.TEXT,
            allowNull: false
        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("pages", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Page = instance.define("pages", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return Page;
}

module.exports = { Schema , Model};