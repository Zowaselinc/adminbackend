const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        subject: {
            type: Sequelize.STRING,
           
        },
        message: {
            type: Sequelize.TEXT,
        },
        recipients: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
        },
        
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("email", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Email = instance.define("email", Schema(Sequelize, 2), { timestamps: false });
    return Email;
}

module.exports = { Schema, Model };