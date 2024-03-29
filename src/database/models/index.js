
const Sequelize = require("sequelize");

require('dotenv').config();
const createSequelizeInstance = () => {
  const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: true,
    port: process.env.DATABASE_PORT ?? 3306,

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
const ErrorLog = DB.errorlogs = require("./errorlog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Role = DB.roles = require("./role.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Adminlog = DB.adminlogs = require("./adminlog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Activitylog = DB.activitylogs = require("./activitylog.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Ticket = DB.tickets = require("./ticket.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const TicketConversation = DB.ticket_conversations = require("./ticket_conversation.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Message = DB.messages = require("./message.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const AdminNotification = DB.admin_notifications = require("./admin_notification.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const User = DB.users = require("./user.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Company = DB.companies = require("./company.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Section = DB.sections = require("./section.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);



const Merchant = DB.merchants = require("./merchant.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Corporate = DB.corporate = require("./corporate.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Agent = DB.agents = require("./agent.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);

const Partner = DB.partners = require("./partner.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Pricing = DB.pricings = require("./pricing.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Transaction = DB.transactions = require("./transaction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const CropSpecification = DB.cropSpecifications = require("./cropSpecification.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Crop = DB.crops = require("./crop.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const CropRequest = DB.cropRequests = require("./cropRequest.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Auction = DB.auctions = require("./auction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Order = DB.orders = require("./order.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Wallet = DB.wallets = require("./wallet.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const MerchantType = DB.merchantTypes = require("./merchantType.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const BankAccount = DB.bankAccount = require("./bankAccount.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Category = DB.categories = require("./category.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const SubCategory = DB.subcategories = require("./subcategory.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Negotiation = DB.negotiation = require("./negotiation.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Input = DB.input = require("./input.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Conversation = DB.conversation = require("./conversation.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Color = DB.color = require("./color.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Assignnegotiation = DB.assign_negotiation = require("./assign_negotiation.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Page = DB.page = require("./page.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Block = DB.block = require("./block.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const KnowledgebaseArticle = DB.KnowledgebaseArticle = require("./knowlegebase_article.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const KnowledgebasCategory = DB.KnowledgebasCategory = require("./knowledgebase_category.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const KYC = DB.kyc = require("./kyc.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const KYB = DB.kyb = require("./kyb.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Kycdocs = DB.kycdocs = require("./kycdocs.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Sms = DB.sms = require("./adminsms.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const ManagerAssignee = DB.managerAssignee = require("./manager_assignee.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Vfdwallet = DB.vfdwallet = require("./vfdwallet.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Email = DB.email = require("./email.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Gallery = DB.gallery = require("./gallary.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Loan = DB.loan = require('./loan.model').Model(initialInstance, createSequelizeInstance(), Sequelize);

//Register Relationships
//---------------------------------------------------
//Register Relationships
//---------------------------------------------------

Merchant.belongsTo(User, { foreignKey: "user_id" });

Corporate.belongsTo(User, { foreignKey: "user_id" });

Agent.belongsTo(User, { foreignKey: "user_id" });

Partner.belongsTo(User, { foreignKey: "user_id" });


// Merchant.belongsTo(KYC, { foreignKey : "user_id"});

// Corporate.belongsTo(KYC , { foreignKey : "user_id"});

// Agent.belongsTo(KYC , { foreignKey : "user_id"});

// Partner.belongsTo(KYC , { foreignKey : "user_id"});

// KYC.belongsTo(User , { foreignKey : "user_id"});


/* ---------------------------------- CROP ---------------------------------- */
User.hasMany(Crop, {
  foreignKey: "user_id",
  as: "crops"
})
Crop.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

Crop.belongsTo(Company, {
  foreignKey: "id",
  as: "usercompany"
})

Crop.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});

Crop.belongsTo(SubCategory, {
  foreignKey: "subcategory_id",
  as: "subcategory"
});

Crop.hasOne(CropSpecification, {
  foreignKey: 'model_id',
  as: 'specification'
})

Crop.hasOne(Auction, {
  foreignKey: "crop_id",
  as: "auction"
});




User.hasMany(Input, {
  foreignKey: "user_id",
  as: "inputs"
})
Input.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

Input.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category"
});

Input.belongsTo(SubCategory, {
  foreignKey: "subcategory_id",
  as: "subcategory"
});



CropSpecification.belongsTo(Crop, {
  foreignKey: 'model_id',
  as: 'crop'
});

Crop.hasMany(CropRequest, {
  foreignKey: 'crop_id',
  as: 'crop_request'
})

CropRequest.belongsTo(Crop, {
  foreignKey: 'crop_id',
  as: 'crop'
});

Category.hasMany(Crop, {
  foreignKey: "category_id",
});

Category.hasMany(Input, {
  foreignKey: "category_id",
});

SubCategory.hasMany(Input, {
  foreignKey: "subcategory_id",
});

SubCategory.hasMany(Crop, {
  foreignKey: "subcategory_id",
});

// Cart.hasOne(Input,{ foreignKey: 'id' })

// Input.hasMany(Cart,{
//   foreignKey: 'input_id',
//   as: 'input_cart'
// })

Negotiation.hasOne(CropSpecification, {
  foreignKey: "model_id",
  as: "specification"
});



Negotiation.hasOne(Order, {
  foreignKey: "negotiation_id",
  as: "order"
});





Conversation.hasMany(Negotiation, {
  foreignKey: "conversation_id",
  as: "negotiations"
});

Conversation.belongsTo(Crop, {
  foreignKey: "crop_id",
  as: "crop"
});

Conversation.belongsTo(User, {
  foreignKey: "user_one",
  as: "initiator",
  constraints: false
});

Conversation.belongsTo(User, {
  foreignKey: "user_two",
  as: "participant",
  constraints: false
});

Order.belongsTo(User, {
  foreignKey: 'buyer_id',
  as: "buyer"
})
Order.belongsTo(User, {
  foreignKey: 'seller_id',
  as: "seller"
});

Order.belongsTo(Negotiation, {
  foreignKey: "negotiation_id",
  as: "negotiation"
});


User.hasOne(Company, {
  foreignKey: "user_id",
  as: "company"
});

/* ----------------------------------- KYC ---------------------------------- */

User.hasOne(KYC, {
  foreignKey: "user_id",
  as: "kyc"
});
User.hasOne(Merchant, {
  foreignKey: "user_id",
  as: "merchant"
});
User.hasOne(Corporate, {
  foreignKey: "user_id",
  as: "corporate"
});
User.hasOne(Partner, {
  foreignKey: "user_id",
  as: "partner"
});
User.hasOne(Agent, {
  foreignKey: "user_id",
  as: "agent"
});

/* ----------------------------------- KYB ---------------------------------- */

User.hasOne(KYB, {
  foreignKey: "user_id",
  as: "kyb"
});


User.hasOne(Kycdocs, {
  foreignKey: "user_id",
  as: "kycdocs"
});

Email.hasOne(Admin, {
  foreignKey: "admin_id",
  as: "admin"
});








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
  AdminNotification,
  User,
  Company,
  MerchantType,
  Merchant,
  Corporate,
  Agent,
  Partner,
  Pricing,
  Transaction,
  CropSpecification,
  Crop,
  Conversation,
  CropRequest,
  Auction,
  Order,
  Wallet,
  BankAccount,
  Category,
  SubCategory,
  Negotiation,
  Input,
  Section,
  Color,
  Assignnegotiation,
  Page,
  Block,
  KnowledgebaseArticle,
  KnowledgebasCategory,
  KYC,
  KYB,
  Kycdocs,
  Sms,
  ManagerAssignee,
  Vfdwallet,
  Email,
  Gallery,
  Loan
};