const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User,MerchantType,Corporate, Merchant,Wallet,Company, ErrorLog, Activitylog, KYC, KYB,} = require("~database/models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const md5 = require("md5");
const { mydb } = require("~utilities/backupdriver");
const { sendhtmlEMAIL,} = require("~services/semdgridMailertwo");
const { sendSmsSINGLE } = require("~services/sms");
const serveAdminid = require("~utilities/serveAdminId");
require("dotenv").config();



class UserbasicController {
    static async registerBasicMerchantCorporate(req, res) {
        try {
            // let user;
            /* ---------------- this end point creates users with out kyc --------------- */

            // var checkUser = await User.findAll({
            //     where: {
            //         [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }],
            //     },
            // });

            // if (checkUser.length > 0) {
            //     return res.status(400).json({
            //         error: true,
            //         message: "User with this email or phone number already exist",
            //     });
            // } else {
                const data = req.body;
                let user = await UserbasicController.saveBasicUser(data);


                const emailMessageContent = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="Font-family: 'Radio Canada', sans-serif;">
              <head> </head>
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="x-apple-disable-message-reformatting" /><!--[if !mso]><!-->
                <meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]-->
                <style type="text/css">
                  * {
                    text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                    -moz-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                  }
            
                  html {
                    height: 100%;
                    width: 100%;
                  }
            
                  body {
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 100% !important;
                    mso-line-height-rule: exactly;
                  }
            
                  div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                  }
            
                  table,
                  td {
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                  }
            
                  img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                  }
            
                  .ReadMsgBody,
                  .ExternalClass {
                    width: 100%;
                  }
            
                  .ExternalClass,
                  .ExternalClass p,
                  .ExternalClass span,
                  .ExternalClass td,
                  .ExternalClass div {
                    line-height: 100%;
                  }
                </style><!--[if gte mso 9]>
                  <style type="text/css">
                  li { text-indent: -1em; }
                  table td { border-collapse: collapse; }
                  </style>
                  <![endif]-->
                <title> Zowasel Welcome Email </title>
                <style>
                  @media only screen and (max-width:600px) {
            
                    .column,
                    .column-filler {
                      box-sizing: border-box;
                      float: left;
                    }
            
                    .col-sm-12 {
                      display: block;
                      width: 100% !important;
                    }
                  }
                </style>
                <!-- content -->
                <link href="https://fonts.googleapis.com/css2?family=Radio+Canada&amp;display=swap" rel="stylesheet" />
                <!--[if gte mso 9]><xml>
                   <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                   </o:OfficeDocumentSettings>
                  </xml><![endif]-->
              </head>
              <body class="body" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; margin: 0; width: 100%;">
    <table class="bodyTable" role="presentation" width="100%" align="left" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; width: 100%; background-color: #FFFFFF; margin: 0;" bgcolor="#FFFFFF">
      <tbody><tr style="Font-family: 'Radio Canada', sans-serif;">
        <td class="body__content" width="100%" valign="top" style="color: #616161;font-family: Helvetica,Arial,sans-serif;font-size: 16px;line-height: 20px;Font-family: 'Radio Canada', sans-serif;">
          <div class="border-green container" style="Font-family: 'Radio Canada', sans-serif; max-width: 600px; margin: 0 auto; width: 100%; border-left: 1px solid #008D40; border-right: 1px solid #008D40; text-align: center;"> <!--[if mso | IE]> <table class="container__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; margin-right: auto; margin-left: auto; text-align: center;width: 600px" width="600" align="center">
              <tr style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                <td style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center"> <![endif]--> <table class="container__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                    <tbody><tr class="container__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                      <td class="container__cell" width="100%" align="center" valign="top" style="Font-family: 'Radio Canada', sans-serif; border-left: 1px solid #008D40; border-right: 1px solid #008D40; text-align: center;">
                        <div class="header row" style="background-color: #008D40; padding: 25px 0 35px; color: #000000; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; text-align: center;">
                          <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                              <td class="px-xs column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif; padding: 0 10px;width: 100%; text-align: center" align="center" valign="top">
                                <center style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                <img src="https://zowaselassets-com.stackstaging.com/logo.png" alt="Zowasel logo" border="0" class="img__block" style="Font-family: 'Radio Canada', sans-serif; max-width: 100%; text-align: unset; display: inline-block;" />
                                  <center style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                  </center>
                                </center>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
                      </td>
                    </tr>
                  </tbody></table> <!--[if mso | IE]> </td>
              </tr>
            </table> <![endif]--> </div>
          <div class="border mb container" style="Font-family: 'Radio Canada', sans-serif;max-width: 600px;margin: 0 auto;width: 100%;border: 1px solid #F0EFEB;border-top: none;margin-bottom: 35px;"> <!--[if mso | IE]> <table class="container__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; margin-right: auto; margin-left: auto; width: 600px" width="600">
              <tr style="Font-family: 'Radio Canada', sans-serif;">
                <td style="Font-family: 'Radio Canada', sans-serif;> <![endif]--> <table class="container__table" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="Font-family: 'Radio Canada', sans-serif;">
                    <tbody><tr class="container__row" style="Font-family: 'Radio Canada', sans-serif;">
                      <td class="container__cell" width="100%" valign="top" style="padding: 0 20px 0; Font-family: 'Radio Canada', sans-serif; border: 1px solid #F0EFEB; border-top: none;">
                        <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                <p class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF; padding: 35px 0; margin-top: 15px;">Dear Customer,</p>
                              </td>
                            </tr>
                          </tbody></table>
                        </div><div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                <p class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">We are writing to inform you about an exciting development at Zowasel. In line with our mission to build sustainable value chains across communities, people and the planet, we are thrilled to present you with a more efficient and user-friendly platform.</p>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
                        <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                <div class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">To access your upgraded account, visit  <a href="https://platform.zowasel.com" style="text-decoration: none;">Zowasel (click here)</a> please use the following login details:
  <p></p><ul style="margin-top: 5px;">
    <li>Email: ${data.email}</li>
    <li>Temporary Password: ${data.password}</li>
    <li>Phone no.: ${data.phone}</li>
  </ul>
  Please remember to change your temporary password when you log in for the first time to ensure the security of your account.<p></p></div>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
  
    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                <div class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">If you require any assistance or have any questions, our dedicated support team is available to help. You can reach us via:
                                    <ul style="margin-top: 5px;">
    <li>Call: +234 01 342 4403</li>
    <li>WhatsApp: +234 70 250 656 64</li>
    <li>Email support: <a href="mailto:marketplace@zowasel.com" style="text-decoration: none;">marketplace@zowasel.com</a></li>
  </ul><p></p></div>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                    <p class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">For partnership inquiries, please contact us at <a href="mailto:partners@zowasel.com" style="text-decoration: none;">partners@zowasel.com</a>.
  </p>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF;">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                        <p class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">We appreciate your continued support and trust in Zowasel. We are confident that our platform upgrade will greatly enhance your experience and enable us to serve you even better..
  </p>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; margin-bottom: 40px">
                          <table class="row__table" width="100%" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed;">
                            <tbody><tr class="row__row" style="Font-family: 'Radio Canada', sans-serif;">
                              <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%;" valign="top">
                                        <p class="whitebg my mt-sm" style="line-height: 40px; color: #616161; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF;">Thank you for being a valued customer.<br>
  Best regards. <br>
  The Zowasel Team
  </p>
                              </td>
                            </tr>
                          </tbody></table>
                        </div>
                        
                        
                        
                        
                      </td>
                    </tr>
                  </tbody></table> <!--[if mso | IE]> </td>
              </tr>
            </table> <![endif]--> </div>
        </td>
      </tr>
    </tbody></table>
    <div style="Font-family: 'Radio Canada', sans-serif; display: none; white-space: nowrap; font-size: 15px; line-height: 0; text-align: center;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
  
  </body>
            </html>
            `;

            const phoneMessageContent = `Dear ${data.first_name}, Exciting news from Zowasel! We've upgraded our platform for a better experience, you can login into the https://platform.zowasel.com with
            this phone number: ${data.phone} and Password. Temporary password: ${data.password}.Change your password for security reasons. Need help? Call +234 01 342 4403, WhatsApp +234 70 250 656 64, Email marketplace@zowasel.com. For partnerships, email partners@zowasel.com. 
            Thank you for trusting Zowasel. Best regards, Zowasel Team.`;
  
            var UserTypeModel = data.user_type == "merchant" ? Merchant : Corporate;
 ś
            /* ------- send message or mail or both depending on the one supplied ------- */
            if (data.email != "null" && data.phone != "null"){
              sendSmsSINGLE(data.phone, phoneMessageContent);
              sendhtmlEMAIL(data.email, "ZOWASEL PLATFORM UPGRADE", emailMessageContent);  
            }else if (data.email != "null" && data.phone == "null"){
              sendhtmlEMAIL(data.email, "ZOWASEL PLATFORM UPGRADE", emailMessageContent);  
            } else if(data.phone != "null" && data.email == "null"){
              sendSmsSINGLE(data.phone, phoneMessageContent);
            } 
         
                var UserTypeModel = data.user_type == "merchant" ? Merchant : Corporate;

                let change;
                if (data.user_type == "merchant") {
                    var merchantType = await MerchantType.findOne({
                        where: { title: "grower" },
                    });
                    if (merchantType) {
                        change = { type_id: merchantType.id };
                    }
                } else {
                    change = { type: "red-hot" };
                }

                await UserTypeModel.create({ ...change, ...{ user_id: user.id } }).catch(
                    (error) => {
                        return res.status(400).json({
                            error: true,
                            message: error.sqlMessage,
                        });
                    }
                );

                  if (data.has_company) {
                    var response = await UserbasicController.saveBasicCompany(user, data);
                    if (response.error) {
                        return res.status(400).json({
                            error: true,
                            message: response.message,
                        });
                    }
                }

                 /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
                    var adminId = await  serveAdminid.getTheId(req);
                            
                    await Activitylog.create({
                    admin_id:adminId ,
                    section_accessed:'Adding new user (corporate or merchant)',
                    page_route:'/api/admin/user/account/addbasicuser',
                    action:'Added new user (corporate or merchant)'
                });
                //   end
                

                     return res.status(200).json({
                    error: false,
                    status: true,
                    message: "user registered successfully",
                    user: user,
                });
            
            
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating user",
                error_description: error.toString(),
                route: "/api/admin/user/create",
                error_code: "500",
            });
            // return res.status(500).json({
            //     error: true,
            //     message: 'Unable to complete request at the moment commmmmmmmm' + '' + error.toString(),
            // })
            // if(logError){

            // }
        }
    }

    static async saveBasicUser(data) {
        try {
            let user;
            let encryptedPassword = await bcrypt.hash(data.password, 10);

            user = await User.create({
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                email: data.email,
                is_verified: 0,
                status: 1,
                password: encryptedPassword,
                type: data.user_type,
                dob: data.dateofbirth,
                gender: data.gender,
                // account_type: "individual",
                account_type:
                    data.has_company || data.company_email ? "company" : "individual",
            });


              const applicantId = crypto.randomBytes(16).toString("hex");
              const checkeId = crypto.randomBytes(16).toString("hex");

            let userbvn = "";
            if(data.bvn != ""){
                userbvn = EncryptConfig(data.bvn)
            }

             var kycVerification = await KYC.create({
                user_id: user.id,
                applicant_id: applicantId,
                check_id: checkeId,
                status: "complete",
                id_type: data.id_type,
                id_number: data.id_number,
                files: JSON.stringify({front: data.id_front, back: data.id_back}),
                bvn:  userbvn,
                verified: 1

            });

            let wallet = await Wallet.create({
                user_id: user.id,
                balance: 0,
            });
           

            return user;

          

        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on create basic user",
                error_description: error.toString(),
                route: "/admin/user/account/addbasicuser",
                error_code: "500",
            });
            // if (logError) {
            //     return res.status(500).json({
            //         error: true,
            //         message:
            //             "Unable to complete request at the moment userrrrrrr " +
            //             " " +
            //             "" +
            //             error.toString(),
            //     });
            // }
        }
    }

    static async saveBasicCompany(user, data) {

        let company;
        

        try {
            // company registration
            company = await Company.create({
                user_id: user.id,
                company_name: data.company_name,
                company_address: data.company_address,
                company_phone: data.company_phone,
                company_email: data.company_email,
                state: data.company_state,
                country: data.company_country,
                contact_person: data.contact_person,
                rc_number: data.rc_number,
                company_website: data.company_website,
            });

            let checkeId = crypto.randomUUID();
             var  userkyb = await KYB.create({
                  user_id: user.id,
                  tax_id: data.tax_id,
                  cac: data.cac,
                  financial_statement: data.financial_statement,
                  mou: data.mou,
                  check_id: checkeId,
                  status: "pending"
              });


            

        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating user account",
                error_description: error.toString(),
                route: "/api/admin/user/account/add",
                error_code: "500",
            });
            // if (logError) {
            //     return res.status(500).json({
            //         error: true,
            //         message:
            //             "Unable to complete request at the moment sooooooooo" + " " + "" +error.toString(),
            //     });
            // }
        }

        return company;
    }



    /* --------------------------- delete basic users --------------------------- */

    static async deleteBsicuser(req, res){
        try{
    
        var delbasicuser = await User.destroy({where : {id:req.params.id}});
    
        // find and delete the hubspot user's wallet 
        var delwallet = await Wallet.destroy({where : {user_id : req.params.id}});
    
        // find and delete the hubspot user form  merchant table 
        var delmerchant = await Merchant.destroy({where : {user_id : req.params.id}});
        // check and delete corporate user from the corporate table 
        var delcorporate = await Corporate.destroy({where : {user_id : req.params.id}});

        // check and delete users company from the company table
        var delcompany= await Company.destroy({where : {user_id : req.params.id}});



             /* ---------------------------------- ADMIN ACTIVITY LOG --------------------------------- */
             var adminId = await  serveAdminid.getTheId(req);
                     
             await Activitylog.create({
               admin_id:adminId ,
               section_accessed:'Deleting basic user',
               page_route:'/api/admin/user/account/delete/:id',
               action:'Deleted a basic user'
           });
         //   end
    
        if(delbasicuser){
          return res.status(200).json({
            error: false,
            message:"Basic user deleted successfuly"
          })
        }else{
          return res.status(400).json({
            error: true,
            message : "Failed to delete basic user"
          })
        }
      }catch(error){
    
        var logError = await ErrorLog.create({
          error_name: "Error on deleting basic users by id",
          error_description: error.toString(),
          route: "/admin/user/account/delete/:id",
          error_code: "500"
      });
      if(logError){
          return res.status(500).json({
              error: true,
              message: 'Unable to complete request at the moment' + '' + error.toString(),
          })
    
      }
      }
    
      
    }
}

module.exports = UserbasicController;
