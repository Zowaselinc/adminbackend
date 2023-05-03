// const generateTimestamps = require("./timestamps");

// let Schema = (Sequelize, mode) => {
//     return {
//         mailer: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         subject: {
//             type: Sequelize.STRING
//         },
//         template: {
//             type: Sequelize.STRING,
//         },
        
//         ...generateTimestamps(Sequelize, mode)
//     }
// }
// const Model = (sequelize, instance, Sequelize) => {
//     // Define initial for DB sync
//     sequelize.define("email", Schema(Sequelize, 1), { timestamps: false });
//     // Bypass initial instance to cater for timestamps
//     const Email = instance.define("email", Schema(Sequelize, 2), { timestamps: false });
//     return Email;
// }

// module.exports = { Schema, Model };