const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        image_id: {
            type: Sequelize.TEXT,
           
        },
        image_path: {
            type: Sequelize.TEXT,
           
        },
       
        
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("gallery", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Gallery = instance.define("gallery", Schema(Sequelize, 2), { timestamps: false });
    return Gallery;
}

module.exports = { Schema, Model };