

/* -------------------------------------------------------------------------- */
/*                               ALL CONTROLLERS                              */
/* -------------------------------------------------------------------------- */
const AdminController = require('~controllers/AdminController');
const AdminlogController = require('~controllers/adminlogController');
const AuthController = require('~controllers/AuthController');
const RoleController = require('~controllers/RoleController');
const ActivitylogController = require('~controllers/ActivitylogController');
const TicketController = require('~controllers/TicketController');
const MessageController = require('~controllers/MessageController');
const Ticket_conversationController = require('~controllers/Ticket_conversationController');
const Admin_notificationController = require('~controllers/Admin_notificationController');
const emailController = require('~controllers/emailController');
const UserController = require('~controllers/UserController');
const ErrorlogController = require('~controllers/ErrorlogController');
const CompanyController = require('~controllers/CompanyController');
const OrderController = require('~controllers/OrderController');
const Input = require('~controllers/InputProductController');
const CropController = require('~controllers/CropController');
const CropRequestController = require('~controllers/CropRequestController');
const CropSpecificationController = require('~controllers/CropSpecificationController');
const CategoryController= require('~controllers/CategoryController');
const SubCategoryController= require('~controllers/SubcategoryController');
const NegotiationController= require('~controllers/NegotiationController');
const SectionController= require('~controllers/SectionController');
const ColourController= require('~controllers/ColourController');
const Assign_negotiationController= require('~controllers/Assign_negotiationController');




/* -------------------------------------------------------------------------- */
/*                               ALL CONTROLLERS                              */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                              // ALL VALIDATORS                             */
/* -------------------------------------------------------------------------- */
const AdminValidator = require('./validators/AdminValidator');
const AuthValidator = require('./validators/AuthValidator');
const Ticketvalidator = require('./validators/TicketValidator');
const MessageValidator =require('./validators/MessageValidator');
const InputsValidator = require('./validators/InputsValidator');
const OrderValidator = require('./validators/OrderValidator');
const CropValidator = require('./validators/CropValidator');
const CropSpecificationValidator = require('./validators/CropSpecificationValidator');
const CropRequestValidator = require('./validators/CropRequestValidator');
const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const NegotiationValidator = require('./validators/NegotiationValidator');
const SectionValidator = require('./validators/SectionValidator');
const RoleValidator = require('./validators/RoleValidator');
const ColourValidator = require('./validators/ColourValidator');
/* -------------------------------------------------------------------------- */
/*                              // ALL VALIDATORS                             */
/* -------------------------------------------------------------------------- */


/* --------------------------- // providerS --------------------------- */
const RouteProvider = require('~providers/RouteProvider');

const Router = RouteProvider.Router;
/* --------------------------- // providerS --------------------------- */

                // **********************************************
/* --------------------------- // DASHBOARD ROUTES -------------------------- */

/* ------------------------- // Authentication route ------------------------ */
Router.group((router)=>{
    router.post('/admin/auth/login',AuthValidator.loginAdminValidator,AuthController.login );
    router.post('/admin/auth/register',AdminValidator.createAdminValidator,AuthController.registerAdmin);
   
});

/* --------------------------- // mailer end point -------------------------- */
Router.group((router)=>{
    router.post('/admin/email/sendmail',emailController.sendEmail);
   
});

/* ----------------------------- // Admin routes ---------------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{

    router.post('/admin/add', AdminValidator.createAdminValidator, AdminController.createAdmin);
    router.get('/admin/getall', AdminController.getAllAdmins);
    router.get('/admin/getbyadminid/:admin_id', AdminController.getadminbyadminid);
    router.get('/admin/getbyid/:id', AdminController.getadminbyid);
    router.get('/admin/getbyemail/:email', AdminController.getbyemail);
    // router.post('/admin/edit', AdminValidator.editAdminValidator, AdminController.editAdminbyid);
    router.post('/admin/editbyadminid', AdminValidator.editAdminValidator, AdminController.editAdminbyadminid);
    router.post('/admin/deletebyadminid/:admin_id', AdminController.deleteAdminbyadminid);
    // router.post('/admin/delete/:id', AdminController.deleteAdminbyid);
    router.get('/admin/getallparams/:offset/:limit', AdminController.getadminbyparams);


});

/* --------------------------- // Routes for roles -------------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/roles/add',RoleValidator.roleValidator, RoleController.createRoles);
    router.get('/admin/roles/getall',RoleController.getAllRoles);
    router.get('/admin/roles/getallparams/:offset/:limit',RoleController.getRolesbyparams);
    router.get('/admin/roles/getbyid/:id',RoleController.getRolesbyid);
    router.get('/admin/roles/getbyroleid/:role_id',RoleController.getRolebyroleid);
    router.post('/admin/roles/edit',RoleController.editRole);
    router.post('/admin/roles/delete/:id',RoleController.deleteRole);

});



/* ------------------------- // Routes for Errorlogs ------------------------ */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.get('/admin/errolog/getall',ErrorlogController.getallErrologs);
    router.get('/admin/errolog/getallparams/:offset/:limit',ErrorlogController.geterrologsbyparams);
    router.get('/admin/errolog/getbyid/:id',ErrorlogController.getErrorlogbyid);
    router.post('/admin/errolog/delete/:id',ErrorlogController.deleteErrorlogbyid);
 });


/* ------------------------- // Routes for Adminlogs ------------------------ */
Router.middleware(['isAuthenticated']).group((router)=>{
   router.get('/admin/adminlog/getall',AdminlogController.getAllAdminlog);
   router.get('/admin/adminlog/getallparams/:offset/:limit',AdminlogController.getadminlogbyparams);
   router.get('/admin/adminlog/getbyid/:id',AdminlogController.getadminlogbyid);
   router.get('/admin/adminlog/getbyadminid/:admin_id',AdminlogController.getadminlogbyAdminid);
});

/* ----------------------- // Routes for activitylogs ----------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.get('/admin/activitylog/getall',ActivitylogController.getAllActivitylogs);
    // router.get('/admin/activitylog/add',ActivitylogController.createActivitylog);
    router.get('/admin/activitylog/getbyid/:id',ActivitylogController.getActivitylogbyid);
    router.get('/admin/activitylog/getbyadminid/:admin_id',ActivitylogController.getActivitylogbyAdminid);
    router.get('/admin/activitylog/getallparams/:offset/:limit',ActivitylogController.getActivitylogbyparams);
    router.post('/admin/activitylog/delete',ActivitylogController.deleteActy);

 
 });
/* --------------------- //  ROUTE FOR TICKETS END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/ticket/add',Ticketvalidator.ticketValidator,TicketController.createTicket);
    router.get('/admin/ticket/getall',TicketController.getAllTickets);
    router.get('/admin/ticket/getbyid/:id',TicketController.getTicketbyid);
    router.get('/admin/ticket/getbyticketid/:ticket_id',TicketController.getbyTicketid);
    router.get('/admin/ticket/getbyuserid/:user_id',TicketController.getticketbyuserid);
    router.get('/admin/ticket/getallparams/:offset/:limit',TicketController.getTicketsbyparams);
    router.post('/admin/ticket/edit',TicketController.editTicket);
    router.post('/admin/ticket/delete/:id',TicketController.deleteTicket);
    router.post('/admin/ticket/getstatus',TicketController.ticketStatus);
 });



 /* --------------------- //  ROUTE FOR SECTION END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/section/add',SectionValidator.sectionValidator,SectionController. createSection);
    router.get('/admin/section/getall',SectionController.getAllSections);
    router.get('/admin/section/getbyid/:id',SectionController.getsectionbyid);
    router.get('/admin/section/getbysectionid/:section_id',SectionController.getBysectionid);
    router.get('/admin/section/getallparams/:offset/:limit',SectionController.getsectionbyparams);
    router.post('/admin/section/edit',SectionController.editsectionbyid);
    router.post('/admin/section/delete/:id',SectionController.deletesection);
 });




 /* --------------------- //  ROUTE FOR MESSAGE END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/message/add',MessageValidator.createMessageValidator,MessageController.createMessage);
    router.get('/admin/message/getallparams/:offset/:limit',MessageController.getMessagesbyparams);
    router.get('/admin/message/getbyuserid/:id',MessageController.getMessagebyid);
    router.post('/admin/message/edit',MessageController.editMessage);
    router.post('/admin/message/delete/:id',MessageController.deleteMessage);
 });


 /* --------------- //  ROUTE FOR TICKET CONVERSATION END POINT -------------- */
 Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/ticketcovtn/add',Ticket_conversationController.createTconvtn);  
    router.get('/admin/ticketcovtn/getall',Ticket_conversationController.getAllTconvtn);  
    router.get('/admin/ticketcovtn/getallparams/:offset/:limit',Ticket_conversationController.getTconvtnbyparams);  
    router.get('/admin/ticketcovtn/getbyid/:id',Ticket_conversationController.getTconvtnbyid);  
    router.post('/admin/ticketcovtn/delete/:id',Ticket_conversationController.deleteTconvtn);  
 });

 /* --------------- //  ROUTE FOR ADMIN NOTIFICATION END POINT --------------- */
 Router.middleware(['isAuthenticated']).group((router)=>{
    router.post('/admin/notification/add',Admin_notificationController.createNotification);  
    router.get('/admin/notification/getall',Admin_notificationController.getAllNotification);  
    router.get('/admin/notification/getallparams/:offset/:limit',Admin_notificationController.getNotificationbyparams);  
    router.get('/admin/notification/getbyid/:id',Admin_notificationController.getNotificationbyid); 
    router.post('/admin/notification/edit',Admin_notificationController.editNotification); 
    router.post('/admin/notification/delete/:id',Admin_notificationController.deleteNotification);  
 });

/* ---------------------- //  ROUTE FOR USERS END POINT --------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{

    router.post('/admin/users/regitermerchant',UserController.registerMerchant);  
    router.get('/admin/users/getall',UserController.getAllUsers);  
    router.get('/admin/users/bytype/:type', UserController.getUsersByType);
    router.get('/admin/users/getbyid/:id', UserController.getUserById);
    router.get('/admin/users/getstats', UserController.getUserStats);
 
 });


 /* -------------------- //  ROUTE FOR COMPANIES END POINT ------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{

    router.get('/admin/company/getall',CompanyController.getallCompanies);  
    router.get('/admin/company/getbyuserid/:user_id',CompanyController.getcompanybyuserid);  
    router.get('/admin/company/getbycompanyemail/:company_email',CompanyController.getcompanybyCompanyemail);
    router.get('/admin/company/getallparams/:offset/:limit', CompanyController.getcompaniesbyparams);
 
 });

  /* ---------------------- //  ROUTE FOR ORDER END POINT --------------------- */
Router.middleware(['isAuthenticated']).group((router)=>{

    // router.get('/admin/crop/order/getbyorderid/:orderid', OrderValidator.cropGetOrderByIdValidators, OrderController.getByOrderId);
    // router.post('/admin/crop/order/add', OrderValidator.cropAddOrderValidators, OrderController.createNewOrderOld);
    // router.post('/admin/crop/order/addnew', OrderValidator.cropAddOrderValidators, OrderController.createNewOrder);
    // router.get('/admin/crop/order/getbyorderid/:order_hash', OrderController.getByOrderHash);
    // router.get('/admin/crop/order/getbybuyer/:buyer_id/:buyer_type', OrderController.getByBuyer);
    // router.get('/admin/crop/order/getbynegotiationid/:negotiation_id', OrderController.getByNegotiationId);
    // router.get('/admin/crop/order/getall', OrderController.getByNegotiationId);
    // router.get('/admin/crop/order/getbypaymentstatus/:payment_status', OrderController.getByPaymentStatus);
    // // Tracking Details
    // router.post('/admin/crop/trackingdetails/updatebyorderid', OrderController.updateTrackingDetailsByOrderId);
    router.post('/admin/crop/order/add', OrderValidator.createOrderValidator, OrderController.createNewOrder);
    router.get('/admin/order/:order', OrderController.getByOrderHash);
    router.get('/admin/order/getall', OrderController.getallOrder);
    router.get('/admin/crop/order/getbybuyer/:buyerid/:buyertype', OrderController.getByBuyer);
    router.get('/admin/crop/order/getbynegotiationid/:negotiationid', OrderController.getByNegotiationId);
    router.get('/admin/crop/order/getbypaymentstatus/:paymentstatus', OrderController.getByPaymentStatus);
    // Tracking Details
    router.post('/admin/order/:order/trackingdetails', OrderValidator.updateTrackingDetailsValidators, OrderController.updateTrackingDetailsByOrderId);
    // Waybill Details
    router.post('/admin/order/:order/waybilldetails', OrderValidator.updateWaybillDetailsValidators, OrderController.updateWaybillDetailsByOrderId);
    // Goodreceiptnote Details
    router.post('/admin/order/:order/goodreceiptnote', OrderValidator.updateGoodReceiptDetailsValidators, OrderController.updateWaybillDetailsByOrderId);
 
 });

 /* ---------------------------------- INPUT --------------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {

    router.post('/admin/input/add', InputsValidator.createInputValidator,Input.createInput);
    router.get('/admin/input/getallbyuserid/:user_id', Input.getallInputsByUser);
    router.get('/admin/input/getall', Input.getallInputs);
    router.get('/admin/input/getallbycategoryid/:category_id', Input.getallInputsByCategory);
    router.get('/admin/input/getallbymanufacturer/:manufacturer', Input.getallInputsByManufacturer);
    router.get('/admin/input/getallbypackaging/:packaging', Input.getallInputsByPackaging);
});

/* --------------------- // ROUTES FOR CROPS END POINTS --------------------- */
/* ------------------------------- Crop ------------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
router.router.post('/admin/crop/add', CropValidator.addCropValidator, CropController.add);
router.get('/admin/crop/getbycropwanted', CropController.getByCropWanted);
router.get('/admin/crop/getbycropauction', CropController.getByCropAuctions);
router.get('/admin/crop/getbycropoffer', CropController.getByCropOffer);
router.get('/admin/crop/getbyid/:id', CropController.getById);
// router.post('/admin/crop/product/editbyid', CropValidator.addCropValidator, CropController.editbyid);


/* ------------------------------- CropSpecification ------------------------------ */
router.post('/admin/crop/cropspecification/add', CropSpecificationValidator.addCropSpecificationValidator, CropSpecificationController.add);




/* ------------------------------- CropRequest ------------------------------ */
router.post('/admin/crop/croprequest/add', CropRequestValidator.addCropRequestValidator, CropRequestController.add);
router.get('/admin/crop/croprequest/getall', CropRequestController.getall);
router.get('/admin/crop/croprequest/getall/:offset/:limit', CropRequestController.getallbyLimit);
router.post('/admin/crop/croprequest/getbyid', CropRequestController.getbyid);
router.post('/admin/crop/croprequest/getbyproductid', CropRequestController.getbyproductid);
router.post('/admin/crop/croprequest/editbyid', CropRequestController.editbyid);
});



Router.middleware(['isAuthenticated']).group((router) => {

    /* -------------------------------- Category -------------------------------- */
    router.get('/admin/category/:type/getall', CategoryController.getAllCategories);
    router.get('/admin/category/:type/params/:offset/:limit', CategoryController.getAllByLimit);
    router.get('/admin/category/getbyid/:id', CategoryController.getById);
    router.post('/admin/category/add', CategoryValidator.addCategoryValidator, CategoryController.createCategory);
    router.post('/admin/category/edit', CategoryController.editCategory);
    router.post('/admin/category/delete/:id', CategoryController.deleteCategory);

    /* ------------------------------- SubCategory ------------------------------ */

    router.get('/admin/subcategory/getbycategory/:categoryId', SubCategoryController.getByCategory);
    router.get('/admin/subcategory/getbyid/:id', SubCategoryController.getById);
    router.post('/admin/subcategory/add', SubCategoryValidator.addSubCategoryValidator, SubCategoryController.createSubcategory);
    router.post('/admin/subcategory/edit',SubCategoryController.editSubcategory);
    router.post('/admin/subcategory/delete/:id', SubCategoryController.deleteSubCategory);



    /* ---------------------------- COLOURS END POINT --------------------------- */
    router.get('/admin/colour/getall/', ColourController.getAllColours);
    router.get('/admin/colour/getbyid/:id', ColourController.getColourbyid);
    router.get('/admin/colour/params/:offset/:limit', ColourController.getColourbyparams);
    // router.get('/admin/colour/getbycolourid/:colour_id', ColourController.getColourbycolourid);
    router.post('/admin/colour/add', ColourValidator.addColourValidator, ColourController.createColour);
    router.post('/admin/colour/edit',ColourController.editColour);
    router.post('/admin/colour/delete/:id', ColourController.deleteColour);


});


/* ------------------------------- Negotiation ------------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
router.post('/admin/crop/negotiation/add', NegotiationValidator.addNegotiationValidator, NegotiationController.add);
// router.post('/crop/negotiation/admin/add', NegotiationValidator.addNegotiationValidator, NegotiationController.addmsgbyadmin);
router.get('/admin/crop/:cropId/negotiation/getbyuserid/:userid', NegotiationController.getbyuserid);
// router.get('/admin/crop/negotiation/:userid', NegotiationController.getListByUser);
router.get('/admin/crop/negotiation/getallNegotiations', NegotiationController.gethhh);
router.post('/admin/crop/negotiation/sendoffer', NegotiationController.sendNegotiationOffer);
router.post('/admin/crop/negotiation/accept', NegotiationValidator.negotiation, NegotiationController.acceptNegotiation);
router.post('/admin/crop/negotiation/decline',NegotiationValidator.negotiation, NegotiationController.declineNegotiation);
router.post('/admin/crop/negotiation/close',NegotiationValidator.negotiation, NegotiationController.closeNegotiation);
router.get('/admin/crop/negotiation/grabtransactionby/:status/:userid', NegotiationController.getNegotiationTransactionSummary);
router.get('/admin/crop/negotiation/getallsummary', NegotiationController.getAllNegotiationTransactionSummary);


  /* ---------------------------- ASSIGNED NEGOTIATION TO ADMIN END POINT --------------------------- */
  router.get('/admin/assignnegotiation/getall/',Assign_negotiationController.getAllAssignedNegotiations);
  router.get('/admin/assignnegotiation/getbyid/:id', Assign_negotiationController.getassignNegotiationbyid);
  router.post('/admin/assignnegotiation/add',Assign_negotiationController.assignNegotiationtoAdmin);
  router.post('/admin/assignnegotiation/edit',Assign_negotiationController.editAssignNegotiation);
  router.post('/admin/assignnegotiation/delete/:id',Assign_negotiationController.deleteAssNegotiation);


});

module.exports = Router;


