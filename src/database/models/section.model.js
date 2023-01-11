



const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        section_id: {
            type: Sequelize.STRING
        },
        section_name : {
            type: Sequelize.STRING,
            unique : true
        },
        section_description: {
            type: Sequelize.TEXT
        },
        
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("sections", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Section = instance.define("sections", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Section;
}

module.exports = { Schema , Model};