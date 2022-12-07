
const Sequelize = require("sequelize");

require('dotenv').config();
const createSequelizeInstance = () => {
  const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: false,
    port : process.env.DATABASE_PORT ?? 3306,
  
    pool: {
      max: eval(process.env.DATABASE_POOL_MAX),
      min: eval(process.env.DATABASE_POOL_MIN),
      acquire: eval(process.env.DATABASE_POOL_ACQUIRE),
      idle: eval(process.env.DATABASE_POOL_IDLE)
    }
  });

  return sequelize;
}


const DB = {};

const initialInstance = createSequelizeInstance();

DB.Sequelize = Sequelize;
DB.sequelize = initialInstance;


//Register Sequelize Models
const Admin = DB.admins = require("./admin.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const ErrorLog= DB.errorlogs = require("./errorlog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Role = DB.roles = require("./role.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Adminlog = DB.adminlogs = require("./adminlog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Activitylog = DB.activitylogs = require("./activitylog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Ticket = DB.tickets = require("./ticket.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const TicketConversation = DB.ticket_conversations = require("./ticket_conversation.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Message = DB.messages = require("./message.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const AdminNotification = DB.admin_notifications = require("./admin_notification.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);

//Register Relationships


module.exports = {
  DB,
  Admin,
  ErrorLog,
  Role,
  Adminlog,
  Activitylog,
  Ticket,
  TicketConversation,
  Message,
  AdminNotification
};