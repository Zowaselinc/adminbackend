const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING
        },
        duration: {
            type: Sequelize.STRING
        },
        account_number: {
            type: Sequelize.STRING
        },
        loan_account: {
            type: Sequelize.STRING
        },
        transaction_id: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("active", "closed")
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("loans", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Loan = instance.define("loans", Schema(Sequelize, 2), { timestamps: false });
    return Loan;
}

module.exports = { Schema, Model };