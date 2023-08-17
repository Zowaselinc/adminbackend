const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_type: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "regular"
        },
        account_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("vfdwallets", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Vfdwallet = instance.define("vfdwallets", Schema(Sequelize, 2), { timestamps: false });
    return Vfdwallet;
}

module.exports = { Schema, Model };