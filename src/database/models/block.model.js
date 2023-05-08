const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        block_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        block_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        block_description : {
            type : Sequelize.TEXT,
            allowNull: false
        },
        block_content : {
            type : Sequelize.TEXT,
            allowNull : false,
            
        },
        page_id: {
            type : Sequelize.STRING,
            allowNull : false
        },
        priority : {
            type : Sequelize.INTEGER
        },
        
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("blocks", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Block = instance.define("blocks", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return Block;
}

module.exports = { Schema , Model};