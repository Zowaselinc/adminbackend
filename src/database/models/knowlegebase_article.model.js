const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        article_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        body : {
            type : Sequelize.STRING,
            allowNull: false
        },
        category_id : {
            type : Sequelize.TEXT,
            allowNull : false,
            
        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("knowledgebase_articles", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const KnowledgebaseArticle = instance.define("knowledgebase_articles", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return KnowledgebaseArticle;
}

module.exports = { Schema , Model};