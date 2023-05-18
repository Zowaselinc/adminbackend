const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        admin_id : {
            type: Sequelize.STRING,
            allowNull: false

        },
        user_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        assigned_by : {
            type : Sequelize.STRING,
            allowNull: false
        },
        date_assigned : {
            type : Sequelize.STRING,
            allowNull : false,
            
        },
      
       
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("manager_assignee", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const ManagerAssignee = instance.define("manager_assignee", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden:{
                attributes: {exclude: ['password']},
            }
        }
    });
    return ManagerAssignee;
}

module.exports = { Schema , Model};