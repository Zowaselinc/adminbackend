
const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        // colour_id: {
        //     type: Sequelize.STRING,
        //     allownull: false

        // },
        name : {
            type: Sequelize.STRING,
            unique: true,
            allownull: false

        },
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("colors", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Color = instance.define("colors", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Color;
}

module.exports = { Schema , Model};