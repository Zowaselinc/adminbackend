
const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        colour_id: {
            type: Sequelize.INTEGER(11),
            allownull: false

        },
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
    sequelize.define("colours", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Colour = instance.define("colours", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Colour;
}

module.exports = { Schema , Model};