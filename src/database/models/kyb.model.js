const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tax_id: {
            type: Sequelize.STRING
        },
        cac: {
            type: Sequelize.STRING(300),
        },
        financial_statement: {
            type: Sequelize.STRING(300),
        },
        mou: {
            type: Sequelize.STRING(300),
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("kyb", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Kyb = instance.define("kyb", Schema(Sequelize, 2), { timestamps: false });
    return Kyb;
}

module.exports = { Schema, Model };