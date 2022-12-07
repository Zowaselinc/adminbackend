


const AdminController = require('~controllers/AdminController');
const AdminlogController = require('~controllers/adminlogController');
const AuthController = require('~controllers/AuthController');
const RoleController = require('~controllers/RoleController');
const ActivitylogController = require('~controllers/ActivitylogController');
const TicketController = require('~controllers/TicketController');
const MessageController = require('~controllers/MessageController');



const {Role} = require('~database/models');
const { Admin} = require('~database/models');
const RouteProvider = require('~providers/RouteProvider');
const AdminValidator = require('./validators/AdminValidator');
const AuthValidator = require('./validators/AuthValidator');

const Router = RouteProvider.Router;


// Routes

// Authentication route 
Router.group((router)=>{
    router.post('/admin/auth/login',AuthValidator.loginAdminValidator,AuthController.login );
   
});

// Admin routes 
Router.middleware(['isAuthenticated']).group((router)=>{

    router.post('/admin/add', AdminValidator.createAdminValidator, AdminController.createAdmin);
    router.get('/admin/getall', AdminController.getAllAdmins);
    router.get('/admin/getbyadminid/:admin_id', AdminController.getadminbyadminid);
    router.get('/admin/getbyid/:id', AdminController.getadminbyid);
    router.get('/admin/getbyemail/:email', AdminController.getbyemail);
    router.post('/admin/edit', AdminValidator.createAdminValidator, AdminController.editAdminbyid);
    router.post('/admin/editbyadminid', AdminValidator.createAdminValidator, AdminController.editAdminbyadminid);
    router.post('/admin/deletebyadminid/:admin_id', AdminController.deleteAdminbyadminid);
    router.post('/admin/delete/:id', AdminController.deleteAdminbyid);
    router.get('/admin/getallparams/:offset/:limit', AdminController.getadminbyparams);


});

// Routes for roles 
Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/roles/add',RoleController.createRoles);
    router.get('/admin/roles/getall',RoleController.getAllRoles);
    router.get('/admin/roles/getallparams/:offset/:limit',RoleController.getRolesbyparams);
    router.get('/admin/roles/getbyid/:id',RoleController.getRolesbyid);
    router.get('/admin/roles/getbyroleid/:role_id',RoleController.getRolebyroleid);
    router.post('/admin/roles/edit',RoleController.editRole);
    router.post('/admin/roles/delete/:id',RoleController.deleteRole);

});
// Routes for Adminlogs 
Router.middleware(['isAuthenticated']).group((router)=>{
   router.get('/admin/adminlog/getall',AdminlogController.getAllAdminlog);
   router.get('/admin/adminlog/getallparams/:offset/:limit',AdminlogController.getadminlogbyparams);
   router.get('/admin/adminlog/getbyid/:id',AdminlogController.getadminlogbyid);
   router.get('/admin/adminlog/getbyadminid/:admin_id',AdminlogController.getadminlogbyAdminid);
});

// Routes for activitylogs 
Router.middleware(['isAuthenticated']).group((router)=>{
    router.get('/admin/activitylog/getall',ActivitylogController.getAllActivitylogs);
    router.get('/admin/activitylog/getbyid/:id',ActivitylogController.getActivitylogbyid);
    router.get('/admin/activitylog/getbyadminid/:admin_id',ActivitylogController.getActivitylogbyAdminid);
    router.get('/admin/activitylog/getallparams/:offset/:limit',ActivitylogController.getActivitylogbyparams);

 
 });
//  ROUTE FOR TICKETS END POINT 
Router.middleware(['isAuthenticated']).group((router)=>{
    router.get('/admin/ticket/add',TicketController.createTicket);
    router.get('/admin/ticket/getll',TicketController.getAllTickets);
    router.get('/admin/ticket/getbyid/:id',TicketController.getTicketbyid);
    router.get('/admin/ticket/getbyticketid/:ticket_id',TicketController.getbyTicketid);
    router.get('/admin/ticket/getbyuserid/:user_id',TicketController.getticketbyuserid);
    router.get('/admin/ticket/getallparams/:offset/:limit',TicketController.getTicketsbyparams);
    router.get('/admin/ticket/edit',TicketController.editTicket);
    router.get('/admin/ticket/delete',TicketController.deleteTicket);
 });

 //  ROUTE FOR MESSAGE END POINT 
Router.middleware(['isAuthenticated']).group((router)=>{
    router.get('/admin/message/add',MessageController.createMessage);
    router.get('/admin/message/getall',MessageController.getAllMessages);
    router.get('/admin/message/getallparams/:offset/:limit',MessageController.getMessagesbyparams);
    router.get('/admin/message/getbyid/:id',MessageController.getMessagebyid);
    router.get('/admin/message/edit',MessageController.editMessage);
    router.get('/admin/message/delete/:id',MessageController.deleteMessage);

   

 
 });








module.exports = Router;


