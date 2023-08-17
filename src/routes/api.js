

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
const CategoryController = require('~controllers/CategoryController');
const SubCategoryController = require('~controllers/SubcategoryController');
const NegotiationController = require('~controllers/NegotiationController');
const SectionController = require('~controllers/SectionController');
const ColourController = require('~controllers/ColourController');
const Assign_negotiationController = require('~controllers/Assign_negotiationController');
const ConversationController = require('~controllers/ConversationController');
const PageController = require('~controllers/PageController');
const BlockController = require('~controllers/BlockController');
const KnowledgebasCategory = require('~controllers/Knowledgebase_categoryController');
const KnowledgebaseArticle = require('~controllers/Knowledgebase_articleController');
const UserAuthController = require('~controllers/UserAuthController');
const AccountController = require('~controllers/AccountController');
const KYCController = require('~controllers/KYCController');
const KYBController = require('~controllers/KYBController');
const KycDocsController = require('~controllers/KycDocsController');
const HubspotController = require('~controllers/HubspotController');
const AdminsmsController = require('~controllers/AdminsmsController');
const Manager_assigneeController = require('~controllers/Manager_assigneeController');
const VfdwalletController = require('~controllers/VfdwalletController');
const SmsController = require('~controllers/SmsController');
const UserbasicController = require('~controllers/UsebasicController');
const GalleryContoller = require('~controllers/GalleryController');




/* -------------------------------------------------------------------------- */
/*                               ALL CONTROLLERS                              */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                              // ALL VALIDATORS                             */
/* -------------------------------------------------------------------------- */
const AdminValidator = require('./validators/AdminValidator');
const AuthValidator = require('./validators/AuthValidator');
const Ticketvalidator = require('./validators/TicketValidator');
const MessageValidator = require('./validators/MessageValidator');
const InputsValidator = require('./validators/InputsValidator');
const OrderValidators = require('./validators/OrderValidator');
const CropValidator = require('./validators/CropValidator');
const CropSpecificationValidator = require('./validators/CropSpecificationValidator');
const CropRequestValidator = require('./validators/CropRequestValidator');
const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const NegotiationValidator = require('./validators/NegotiationValidator');
const SectionValidator = require('./validators/SectionValidator');
const RoleValidator = require('./validators/RoleValidator');
const ColourValidator = require('./validators/ColourValidator');
const PageValidator = require('./validators/PageValidation');
const BlockValidator = require('./validators/BlockValidator');
const KnowledgebaseArticleValidator = require('./validators/KnowledgebaseArticleValidator');
const KnowlegebaseCategoryValidator = require('./validators/KnowledgebaseCategoryValidator');

/* ------------------------------- Users VALIDATORS ------------------------------- */

const { RegisterMerchantCorporateValidator, LoginValidator,
    RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator,
    ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator } = require('./validators/UserAuthValidators');


/* --------------------- account, kyc and kyb validator --------------------- */
const AccountValidator = require('./validators/AccountValidator');
/* -------------------------------------------------------------------------- */
/*                              // ALL VALIDATORS                             */
/* -------------------------------------------------------------------------- */


/* --------------------------- // providerS --------------------------- */
const RouteProvider = require('~providers/RouteProvider');
const UserAuthValidators = require('./validators/UserAuthValidators');


const Router = RouteProvider.Router;
/* --------------------------- // providerS --------------------------- */

// **********************************************
/* --------------------------- // DASHBOARD ROUTES -------------------------- */

/* ------------------------- // Authentication route ------------------------ */
Router.group((router) => {
    router.post('/admin/auth/login', AuthValidator.loginAdminValidator, AuthController.login);
    router.post('/admin/auth/register', AdminValidator.createAdminValidator, AuthController.registerAdmin);



});

Router.middleware(['isAuthenticated']).group((router) => {



    router.post('/admin/add', AdminValidator.createAdminValidator, AdminController.createAdmin);

});

/* ---------------------------- gallery endpoint ---------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    // email file upload 
    router.post('/admin/gallery/uploadimg', GalleryContoller.uploadImg);


    router.post('/admin/gallery/deletefile', GalleryContoller.deleteFile);


});
/* --------------------------- // mailer end point -------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {

    // loginmail 
    router.post('/admin/email/sendmail', emailController.sendEmail);


    // individual mails 

    router.post('/admin/email/send/singlemail', emailController.singleMail);

    // bulk email 
    router.post('/admin/email/send/bulkmail', emailController.sendBulkmails);

    /* ----------------------- store mails on the database ---------------------- */
    router.post('/admin/email/draftmail', emailController.draftMail);

    router.get('/admin/email/getall', emailController.getAllEmails);

    router.get('/admin/email/getbyparams/:offset/:limit', emailController.getEmailsbyparams);

    router.get('/admin/email/getbyaminid/:admin_id', emailController.getEmailbyadminid);

    router.get('/admin/email/getbyid/:id', emailController.getEmailbyid);

    router.post('/admin/email/editemail', emailController.editEmail);

    router.post('/admin/email/deleteemail/:id', emailController.deleteEmail);

});


Router.middleware(['isAuthenticated']).group((router) => {
    /* ------------------------SEND SINGLE AND BULK SMS ENDPOINT  --------------------------- */

    router.post('/admin/sendgridsms/sendsinglesms', SmsController.sendTheSms)

    router.post('/admin/sendgridsms/sendbulksms', SmsController.sendBulkSms)
});

// VFD BANK ACCOUNT CREATION ENDPOINT 

Router.group((router) => {

    router.post('/admin/vfd/add', VfdwalletController.createVfdaccount)
    router.get('/admin/vfd', VfdwalletController.getVbankWallet)
    router.get('/admin/vfd/loan', VfdwalletController.getLoans)
    router.post('/admin/loan/disburse', VfdwalletController.disburseLoan)

});




/* ----------------------------- // Admin routes ---------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {


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
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/roles/add', RoleValidator.roleValidator, RoleController.createRoles);
    router.get('/admin/roles/getall', RoleController.getAllRoles);
    router.get('/admin/roles/getallparams/:offset/:limit', RoleController.getRolesbyparams);
    router.get('/admin/roles/getbyid/:id', RoleController.getRolesbyid);
    router.get('/admin/roles/getbyroleid/:role_id', RoleController.getRolebyroleid);
    router.post('/admin/roles/edit', RoleController.editRole);
    router.post('/admin/roles/delete/:id', RoleController.deleteRole);

});



/* ------------------------- // Routes for Errorlogs ------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
    router.get('/admin/errolog/getall', ErrorlogController.getallErrologs);
    router.get('/admin/errolog/getallparams/:offset/:limit', ErrorlogController.geterrologsbyparams);
    router.get('/admin/errolog/getbyid/:id', ErrorlogController.getErrorlogbyid);
    router.post('/admin/errolog/delete/:id', ErrorlogController.deleteErrorlogbyid);
});


/* ------------------------- // Routes for Adminlogs ------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
    router.get('/admin/adminlog/getall', AdminlogController.getAllAdminlog);
    router.get('/admin/adminlog/getallparams/:offset/:limit', AdminlogController.getadminlogbyparams);
    router.get('/admin/adminlog/getbyid/:id', AdminlogController.getadminlogbyid);
    router.get('/admin/adminlog/getbyadminid/:admin_id', AdminlogController.getadminlogbyAdminid);
});

/* ----------------------- // Routes for activitylogs ----------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.get('/admin/activitylog/getall', ActivitylogController.getAllActivitylogs);
    // router.get('/admin/activitylog/add',ActivitylogController.createActivitylog);
    router.get('/admin/activitylog/getbyid/:id', ActivitylogController.getActivitylogbyid);
    router.get('/admin/activitylog/getbyadminid/:admin_id', ActivitylogController.getActivitylogbyAdminid);
    router.get('/admin/activitylog/getallparams/:offset/:limit', ActivitylogController.getActivitylogbyparams);
    router.post('/admin/activitylog/delete', ActivitylogController.deleteActy);


});
/* --------------------- //  ROUTE FOR TICKETS END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/ticket/add', Ticketvalidator.ticketValidator, TicketController.createTicket);
    router.get('/admin/ticket/getall', TicketController.getAllTickets);
    router.get('/admin/ticket/getbyid/:id', TicketController.getTicketbyid);
    router.get('/admin/ticket/getbyticketid/:ticket_id', TicketController.getbyTicketid);
    router.get('/admin/ticket/getbyuserid/:user_id', TicketController.getticketbyuserid);
    router.get('/admin/ticket/getallparams/:offset/:limit', TicketController.getTicketsbyparams);
    router.post('/admin/ticket/edit', TicketController.editTicket);
    router.post('/admin/ticket/delete/:id', TicketController.deleteTicket);
    router.post('/admin/ticket/getstatus', TicketController.ticketStatus);
});



/* --------------------- //  ROUTE FOR SECTION END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/section/add', SectionValidator.sectionValidator, SectionController.createSection);
    router.get('/admin/section/getall', SectionController.getAllSections);
    router.get('/admin/section/getbyid/:id', SectionController.getsectionbyid);
    router.get('/admin/section/getbysectionid/:section_id', SectionController.getBysectionid);
    router.get('/admin/section/getallparams/:offset/:limit', SectionController.getsectionbyparams);
    router.post('/admin/section/edit', SectionController.editsectionbyid);
    router.post('/admin/section/delete/:id', SectionController.deletesection);
});




/* --------------------- //  ROUTE FOR MESSAGE END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/message/add', MessageValidator.createMessageValidator, MessageController.createMessage);
    router.get('/admin/message/getallparams/:offset/:limit', MessageController.getMessagesbyparams);
    router.get('/admin/message/getbyuserid/:id', MessageController.getMessagebyid);
    router.post('/admin/message/edit', MessageController.editMessage);
    router.post('/admin/message/delete/:id', MessageController.deleteMessage);
});


/* --------------------- //  ROUTE FOR MESSAGE END POINT -------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/sms/send', AdminsmsController.sendSms);
    router.get('/admin/sms/getallparams/:offset/:limit', AdminsmsController.getSmsbyparams);
    router.get('/admin/sms/getbyid/:id', AdminsmsController.getSmsbyid);
    router.get('/admin/sms/messageid/:message_id', AdminsmsController.getsmsBymessageid);
    router.get('/admin/sms/byadmin/:admin', AdminsmsController.getSmsbyAdmin);
    router.get('/admin/sms/getall', AdminsmsController.getAllSms);
    router.post('/admin/sms/edit', AdminsmsController.editSms);
    router.post('/admin/sms/delete/:id', AdminsmsController.deleteSms);
});


/* --------------- //  ROUTE FOR TICKET CONVERSATION END POINT -------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/ticketcovtn/add', Ticket_conversationController.createTconvtn);
    router.get('/admin/ticketcovtn/getall', Ticket_conversationController.getAllTconvtn);
    router.get('/admin/ticketcovtn/getallparams/:offset/:limit', Ticket_conversationController.getTconvtnbyparams);
    router.get('/admin/ticketcovtn/getbyid/:id', Ticket_conversationController.getTconvtnbyid);
    router.post('/admin/ticketcovtn/delete/:id', Ticket_conversationController.deleteTconvtn);
});

/* --------------- //  ROUTE FOR ADMIN NOTIFICATION END POINT --------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/notification/add', Admin_notificationController.createNotification);
    router.get('/admin/notification/getall', Admin_notificationController.getAllNotification);
    router.get('/admin/notification/getallparams/:offset/:limit', Admin_notificationController.getNotificationbyparams);
    router.get('/admin/notification/getbyid/:id', Admin_notificationController.getNotificationbyid);
    router.post('/admin/notification/edit', Admin_notificationController.editNotification);
    router.post('/admin/notification/delete/:id', Admin_notificationController.deleteNotification);
});

/* ---------------------- //  REGISTER ALL USERS --------------------- */

// Router.middleware(['isGuest']).group((router)=>{
//     router.post('/admin/users/register', RegisterMerchantCorporateValidator, UserAuthController.registerMerchantCorporate);
//     router.post('/admin/users/register', RegisterMerchantCorporateValidator, UserAuthController.registerMerchantCorporate);

// });
/* ---------------------------- users / company details--------------------------- */

Router.middleware(['isAuthenticated']).group((router) => {
    // CREATE BASIC USERS 
    router.post('/admin/users/account/addbasicuser', UserbasicController.registerBasicMerchantCorporate);
    // BATCH BASIC USER 
    router.post('/admin/users/account/addbatchbasicuser', UserbasicController.basicBatchUser);
    // DELETE BASIC USER 
    router.post('/admin/users/account/deletebasicuser/:id', UserbasicController.deleteBsicuser);

    // CHANGE CORPORATE TYPE TO EITHER BLUE-CHIP OR BROWN-CHIP 
    router.post('/admin/users/account/changecorptype', UserController.updateCorporateype);


    // CREATE BATCH USER 
    router.post('/admin/users/account/batchuser', UserAuthController.BatchUserUpload);

    router.post('/admin/hubspotuser/add', RegisterMerchantCorporateValidator, HubspotController.createHubspotusers);

    router.post('/admin/hubspotuser/delete/:id', RegisterMerchantCorporateValidator, HubspotController.deleHubspotUsers);

    // register corporate and merchant with or without account note, admin does kyc and kyb for users as their account are created

    router.post('/admin/users/register', RegisterMerchantCorporateValidator, UserAuthController.registerMerchantCorporate);

    // change user password 
    router.post('/admin/users/changeuserpassword', UserAuthController.changeUserPassword);
    // update kyc status 
    router.post('/admin/users/account/updatekycstatus', KYCController.updatekycStatus);

    // update kyb status 
    router.post('/admin/users/account/updatekybstatus', UserAuthController.updatekybStatus);

    router.get('/admin/users/getall', UserController.getAllUsers);

    router.get('/admin/users/bytype/:type', UserController.getUsersByType);

    router.get('/admin/users/getbyid/:id', UserController.getUserById);

    router.get('/admin/users/getstats', UserController.getUserStats);

    /* ------------------------ update other user details ----------------------- */
    router.post('/admin/users/account/update', AccountValidator.updateAccountValidator, AccountController.updateAccountDetails);

    /* --------------------------- add company details -------------------------- */
    router.post('/admin/users/account/company/update', AccountValidator.updateCompanyValidator, AccountController.updateCompanyDetails);

    /* ----------------------------- change password ---------------------------- */
    router.post('/admin/users/account/changepassword', AccountValidator.changePasswordValidator, AccountController.changePassword);

    /* ----------------------------------- kyb ---------------------------------- */
    // router.get("/admin/users/account/kycstatus", KYCController.retriveCheck);

    // router.get("/admin/users/account/kycdocument/:id", KYCController.getDocument);

    router.post('/admin/users/account/verifykyb', KYBController.startKybVerification);



    // router.get("admin//users/account/kybstatus", KYBController.retriveCheck);

    // router.get("admin//users/account/kybdocument", KYBController.getDocument);

    /* ----------------------------------- kyc ---------------------------------- */
    router.get('/admin/users/account/kyctypes', KYCController.getDocumentTypes);

    router.post('/admin/users/account/kycverification', KYCController.verifykyc);

    //   router.get("/admin/users/account/kycstatus", KYCController.retriveCheck);

    // router.get("/admin/users/account/kycdocument/:id", KYCController.getDocument);

    /* ----------------------- kyc status and verification ---------------------- */


    /* ------------------------------ kycdocs apis ----------------------------- */
    router.post('/admin/users/account/updatekycdocs', AccountValidator.kycDocs, KycDocsController.updateKycDocs);

    router.get('/admin/users/account/getall', KycDocsController.getAllkycdocs);

    router.get('/admin/users/account/getbyid/:id', KycDocsController.getkycdocsbyid);

    router.get('/admin/users/account/getbyUserid/:user_id', KycDocsController.getkycdocsbyUserid);

    router.get('/admin/users/account/getbyidnumber/:id_number', KycDocsController.getByidnumber);

    router.post('/admin/users/account/edit', KycDocsController.editKyycDocs);

    router.post('/admin/users/account/delete/:id', KycDocsController.deletekycdocs);





});









/* -------------------- //  ROUTE FOR COMPANIES END POINT ------------------- */
Router.middleware(['isAuthenticated']).group((router) => {

    router.get('/admin/company/getall', CompanyController.getallCompanies);
    router.get('/admin/company/getbyuserid/:user_id', CompanyController.getcompanybyuserid);
    router.get('/admin/company/getbycompanyemail/:company_email', CompanyController.getcompanybyCompanyemail);
    router.get('/admin/company/getallparams/:offset/:limit', CompanyController.getcompaniesbyparams);

});

/* ---------------------- //  ROUTE FOR ORDER END POINT --------------------- */
Router.middleware(['isAuthenticated']).group((router) => {

    router.post('/admin/order/add', OrderValidators.createOrderValidator, OrderController.createNewOrder);
    router.get('/admin/order/getall', OrderController.fetchOrder);
    router.post('/admin/order/cart/create', OrderValidators.createCartOrderValidator, OrderController.createCartOrder);
    router.get('/admin/order/:order', OrderController.getByOrderHash);
    router.get('/admin/order/getbybuyer/:buyer_id/:buyertype', OrderController.getByBuyer);
    router.get('/admin/order/getbyseller/:seller_id/:buyertype', OrderController.getBySeller);
    router.get('/admin/order/getbynegotiationid/:negotiationid', OrderController.getByNegotiationId);
    router.get('/admin/order/getbypaymentstatus/:paymentstatus', OrderController.getByPaymentStatus);
    // Tracking Details
    router.post('/admin/order/:order/trackingdetails', OrderController.updateTrackingDetailsByOrderId);
    // Waybill Details
    router.post('/admin/order/:order/waybilldetails', OrderValidators.updateWaybillDetailsValidators, OrderController.updateWaybillDetailsByOrderId);
    // Goodreceiptnote Details
    router.post('/admin/order/:order/goodsreceiptnote', OrderValidators.updateGoodReceiptDetailsValidators, OrderController.updateGoodReceiptNoteByOrderId);


});


//  ********************************************************************************************************************************

/* ---------------------------------- INPUT --------------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {

    router.post('/admin/input/add', Input.createInput);
    router.get('/admin/input/getallbyuserid/:user_id', Input.getallInputsByUser);
    router.get('/admin/input/getall', Input.getallInputs);
    router.get('/admin/input/getbyid/:id', Input.getInputsById);
    router.get('/admin/input/getallbycategoryid/:category_id', Input.getallInputsByCategory);
    router.get('/admin/input/getallbymanufacturer/:manufacturer', Input.getallInputsByManufacturer);
    router.get('/admin/input/getallbypackaging/:packaging', Input.getallInputsByPackaging);
});

/* --------------------- // ROUTES FOR CROPS END POINTS --------------------- */
/* ------------------------------- Crop ------------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/crop/add', CropController.add);
    router.get('/admin/crop/getbycropwanted', CropController.getByCropWanted);
    router.get('/admin/crop/getall', CropController.getAllCrops);
    router.get('/admin/crop/getbycropauction', CropController.getByCropAuctions);
    router.get('/admin/crop/getbycropoffer', CropController.getByCropOffer);
    router.get('/admin/crop/getbyid/:id', CropController.getById);
    router.get('/admin/crop/getbyuserid/:user_id', CropController.getAllCropsByUser);
    router.post('/admin/crop/activatecrop/:id', CropController.activateCropById);
    router.post('/admin/crop/deactivatecrop/:id', CropController.deactivateCropById);
    router.post('/admin/crop/delete/:id', CropController.deleteCropById);
    router.post('/admin/crop/update', CropController.EditById);
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
    router.post('/admin/subcategory/edit', SubCategoryController.editSubcategory);
    router.post('/admin/subcategory/delete/:id', SubCategoryController.deleteSubCategory);



    /* ---------------------------- COLOURS END POINT --------------------------- */
    router.get('/admin/colour/getall/', ColourController.getAllColours);
    router.get('/admin/colour/getbyid/:id', ColourController.getColourbyid);
    router.get('/admin/colour/params/:offset/:limit', ColourController.getColourbyparams);
    // router.get('/admin/colour/getbycolourid/:colour_id', ColourController.getColourbycolourid);
    router.post('/admin/colour/add', ColourValidator.addColourValidator, ColourController.createColour);
    router.post('/admin/colour/edit', ColourController.editColour);
    router.post('/admin/colour/delete/:id', ColourController.deleteColour);


});


/* ------------------------------- Negotiation ------------------------------ */
Router.middleware(['isAuthenticated']).group((router) => {
    router.post('/admin/crop/negotiation/add', NegotiationValidator.addNegotiationValidator, NegotiationController.add);
    router.post('/admin/crop/negotiation/sendmessage', NegotiationController.addAminMsg);
    router.get('/admin/crop/:crop_id/negotiation/getbyuserid/:user_id', NegotiationController.getListByUser);
    //   *****************************
    // router.get('/admin/crop/:cropId/negotiation/:user_id', NegotiationController.getbyuserid);

    // *******************************
    router.get('/admin/crop/negotiation/getallNegotiations', NegotiationController.getall);
    router.post('/admin/crop/negotiation/sendoffer', NegotiationController.sendNegotiationOffer);
    router.post('/admin/crop/negotiation/accept', NegotiationValidator.negotiation, NegotiationController.acceptNegotiation);
    router.post('/admin/crop/negotiation/decline', NegotiationValidator.negotiation, NegotiationController.declineNegotiation);
    router.post('/admin/crop/negotiation/close', NegotiationValidator.negotiation, NegotiationController.closeNegotiation);
    router.get('/admin/crop/negotiation/grabtransactionby/:status/:userid', NegotiationController.getNegotiationTransactionSummary);
    router.get('/admin/crop/negotiation/getallsummary', NegotiationController.getAllNegotiationTransactionSummary);



    /* --------------------------- CONVERSATION ROUTE --------------------------- */
    // router.get('/admin/crop/conversation/:userid', NegotiationController.getListByUser);
    router.get('/admin/crop/conversation/getall', NegotiationController.getAllConversation);
    router.get('/admin/crop/conversation/getallparams/:offset/:limit', NegotiationController.getConversationbyParams);


    // ****************************************



    /* ---------------------------- ASSIGNED NEGOTIATION TO ADMIN END POINT --------------------------- */
    router.get('/admin/assignnegotiation/getall', Assign_negotiationController.getAllAssignedNegotiations);
    router.get('/admin/assignnegotiation/getbyid/:id', Assign_negotiationController.getassignNegotiationbyid);
    router.get('/admin/assignnegotiation/getbyconversationid/:conversationid', Assign_negotiationController.getbyConversationId);
    router.get('/admin/assignnegotiation/getbyadminassigned/:adminassigned', Assign_negotiationController.getbyAdminassigned);
    router.post('/admin/assignnegotiation/add', Assign_negotiationController.assignNegotiationtoAdmin);
    router.post('/admin/assignnegotiation/edit', Assign_negotiationController.editAssignNegotiation);
    router.post('/admin/assignnegotiation/delete/:id', Assign_negotiationController.deleteAssNegotiation);


});
/* ------------------------- ROUTE FOR LANDING PAGE ------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    /* --------------------------- LANDING PAGE ROUTE --------------------------- */
    router.post('/admin/page/add', PageValidator.pageValidator, PageController.createPage);
    router.get('/admin/page/getall', PageController.getAllPages);
    router.get('/admin/page/getbyparams/:offset/:limit', PageController.getPagebyparams);
    router.get('/admin/page/getbyid/:id', PageController.getPagebyid);
    router.get('/admin/page/getbypageid/:page_id', PageController.getPagebyPageid);
    router.post('/admin/page/edit/', PageController.editPagebyid);
    router.post('/admin/page/delete/:id', PageController.deletePagebyid);


    /* -------------------------- LANDING BLOCK ROUTES -------------------------- */
    router.post('/admin/block/add', BlockValidator.blockValidator, BlockController.createBlock);
    router.get('/admin/block/getall', BlockController.getAllBlock);
    router.get('/admin/block/getbyparams/:offset/:limit', BlockController.getBlockbyparams);
    router.get('/admin/block/getbyid/:id', BlockController.getBlockbyid);
    router.get('/admin/block/getbyblockid/:block_id', BlockController.getBlockbyblockid);
    router.post('/admin/block/edit/', BlockController.editBlockbyid);
    router.post('/admin/block/delete/:id', BlockController.deleteBlockbyid);
});
/* --------------------- ZOWASEL LANDING KNOWLEDGE BASE --------------------- */

/* ------------------------ ROUTE FOR ZOWASEL ARTICLE ----------------------- */

Router.middleware(["isGuest"]).group((router) => {
    router.get('/admin/article/getall', KnowledgebaseArticle.getAllArticle);
    router.get('/admin/article/getbyparams/:offset/:limit', KnowledgebaseArticle.getArticlebyparams);
    router.get('/admin/article/getbyid/:id', KnowledgebaseArticle.getArticlebyid);
    router.get('/admin/article/getbyarticleid/:article_id', KnowledgebaseArticle.getArticlebyarticleid);

    // knowledgebase category 

    router.get('/admin/kbcategory/getall', KnowledgebasCategory.getAllKBcategory);
    router.get('/admin/kbcategory/getbyparams/:offset/:limit', KnowledgebasCategory.getKBcategorybyparams);
    router.get('/admin/kbcategory/getbyid/:id', KnowledgebasCategory.getKBcategorybyid);
    router.get('/admin/kbcategory/getbycategoryid/:category_id', KnowledgebasCategory.getkbcategorybycategoryid);

});

Router.middleware(["isAuthenticated"]).group((router) => {
    router.post('/admin/article/add', KnowledgebaseArticleValidator.articleValidator, KnowledgebaseArticle.createArticle);

    router.post('/admin/article/edit/', KnowledgebaseArticle.editArticlebyid);
    router.post('/admin/article/delete/:id', KnowledgebaseArticle.deleteArticlebyid);


    /* ---------------- ROUTE FOR ZOWASEL KNOWLEDGE BASE CATEGORY --------------- */
    router.post('/admin/kbcategory/add', KnowlegebaseCategoryValidator.knowledgebasecategoryValidator, KnowledgebasCategory.createKBcategory);

    router.post('/admin/kbcategory/edit/', KnowledgebasCategory.editkbCategorybyid);
    router.post('/admin/kbcategory/delete/:id', KnowledgebasCategory.deletekbCategorybyid);



});

/* ------------------------- ROUTE FOR LANDING PAGE ------------------------- */
Router.middleware(['isAuthenticated']).group((router) => {
    /* --------------------------- LANDING PAGE ROUTE --------------------------- */
    router.post('/admin/manager/add', Manager_assigneeController.createManagerAssignee);
    router.get('/admin/manager/getall', Manager_assigneeController.getAllManagerAssignee);
    //  router.get('/admin/manager/getbyparams/:offset/:limit',Manager_assigneeController. getManagerAsigneebyid);
    router.get('/admin/manager/getbyid/:id', Manager_assigneeController.getManagerAsigneebyid);
    //  router.get('/admin/manager/getbypageid/:page_id',Manager_assigneeController.getPagebyPageid);
    router.post('/admin/manager/edit', Manager_assigneeController.editManagerassignee);
    router.post('/admin/manager/delete/:id', Manager_assigneeController.delManagerAssigneeid);
});






module.exports = Router;


