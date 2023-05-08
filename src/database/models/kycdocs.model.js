const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        id_type: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        id_front: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        id_back: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        id_number: {
            type: Sequelize.TEXT,
            allowNull: false
        },
       
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("kyc_docs", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Kycdocs = instance.define("kyc_docs", Schema(Sequelize, 2), { timestamps: false });
    return Kycdocs;
}

module.exports = { Schema, Model };