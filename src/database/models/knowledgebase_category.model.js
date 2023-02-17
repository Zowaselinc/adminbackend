const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        category_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        category_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        category_description : {
            type : Sequelize.TEXT,
            allowNull: false
        },

        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("knowledgebase_categories", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const KnowledgebasCategory = instance.define("knowledgebase_categories", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return KnowledgebasCategory;
}

module.exports = { Schema , Model};