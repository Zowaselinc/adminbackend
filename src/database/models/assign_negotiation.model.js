const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
       negotiationid : {
            type: Sequelize.STRING,
            unique : true,
            allowNull : false
        },
        adminassigned : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("assign_negotiation", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Assignnegotiation = instance.define("assign_negotiation", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Assignnegotiation;
}

module.exports = { Schema , Model};