const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// const Mailer = require('~services/mailer');
const md5 = require('md5');
const { EncryptConfig, DecryptConfig } = require("~utilities/encryption/encrypt");
const { mydb } = require("~utilities/backupdriver");
const { sendhtmlEMAIL } = require("~services/mailertwo");
require('dotenv').config();
const emialRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;




class HubspotController {
    static async createHubspotusers(req,res){

        try {
            
   
        const batchuser = req.body.batchuser;
        console.log(batchuser);
        batchuser.forEach(async element => {
                    /* -------------------------- CREATE AND SAVE USER -------------------------- */
                             
                // check for already existing 
                var checkmailPhone = await User.findOne({
                    where:{email:element.email, phone:element.phone}
                })

                if(checkmailPhone){
                    return res.status(200).json({
                        error:true,
                        message:"Email or phone number already exist"
                    })
                }else{

                
            
            let encryptedPassword = await bcrypt.hash(element.password, 10);
            await User.create({
                first_name:element.first_name,
                last_name:element.last_name,
                phone:element.phone,
                email:element.email,
                password:encryptedPassword,
                type: element.user_type,
                account_type: element.has_company || element.company_email ? "company" : "individual",

            });
            sendhtmlEMAIL(element.email,"Welcome to Zowasel",`
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" />
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
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
              <body class="body" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; margin: 0; width: 100%; text-align: center;">
                <table class="bodyTable" role="presentation" width="100%" align="left" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; width: 100%; background-color: #FFFFFF; margin: 0; text-align: center;" bgcolor="#FFFFFF">
                  <tr style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                    <td class="body__content" align="center" width="100%" valign="top" style="color: #000000; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; text-align: center;">
                      <div class="border-green container" style="Font-family: 'Radio Canada', sans-serif; max-width: 600px; margin: 0 auto; width: 100%; border-left: 1px solid #008D40; border-right: 1px solid #008D40; text-align: center;"> <!--[if mso | IE]> <table class="container__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; margin-right: auto; margin-left: auto; text-align: center;width: 600px" width="600" align="center">
                          <tr style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                            <td style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center"> <![endif]--> <table class="container__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                <tr class="container__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                  <td class="container__cell" width="100%" align="center" valign="top" style="Font-family: 'Radio Canada', sans-serif; border-left: 1px solid #008D40; border-right: 1px solid #008D40; text-align: center;">
                                    <div class="header row" style="background-color: #008D40; padding: 25px 0 35px; color: #000000; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="px-xs column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif; padding: 0 10px;width: 100%; text-align: center" align="center" valign="top">
                                            <center style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                              <img src="https://zowaselassets-com.stackstaging.com/logo.png" alt="Zowasel logo" border="0" class="img__block" style="Font-family: 'Radio Canada', sans-serif; max-width: 100%; text-align: unset; display: inline-block;" />
                                              <center style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                              </center>
                                            </center>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table> <!--[if mso | IE]> </td>
                          </tr>
                        </table> <![endif]--> </div>
                      <div class="border mb container" style="Font-family: 'Radio Canada', sans-serif; max-width: 600px; margin: 0 auto; width: 100%; border: 1px solid #F0EFEB; border-top: none; margin-bottom: 35px; text-align: center;"> <!--[if mso | IE]> <table class="container__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; margin-right: auto; margin-left: auto; text-align: center;width: 600px" width="600" align="center">
                          <tr style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                            <td style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center"> <![endif]--> <table class="container__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="Font-family: 'Radio Canada', sans-serif; text-align: center;">
                                <tr class="container__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                  <td class="container__cell" width="100%" align="center" valign="top" style="Font-family: 'Radio Canada', sans-serif; border: 1px solid #F0EFEB; border-top: none; text-align: center;">
                                    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%; text-align: center" align="center" valign="top">
                                            <h1 class="whitebg center my mt-sm header h1" style="line-height: 40px; color: #000000; font-family: Helvetica,Arial,sans-serif; Font-family: 'Radio Canada', sans-serif; margin: 0; background-color: #FFFFFF; padding: 35px 0; margin-top: 15px; text-align: center;">WELCOME TO ZOWASEL</h1>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <div class="whitebg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%; text-align: center" align="center" valign="top">
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;">Hi there,</p>
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;"> Use the following information.</p>
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;"> To login into your account and</p>
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;"> complete your profile </p>
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;">EMAIL: ${element.email } 
                                            <br>TEMPORARY PASSWORD: ${element.password}<br> Note: please endeavor to change this password as it is not secure...</p>
                                           
                                            <p class="mb-sm text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 10px; text-align: center;"> Thank you </p>
                                            
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <div class="whitebg mt mb-lg row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; margin-bottom: 55px; margin-top: 25px; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%; text-align: center" align="center" valign="top">
                                            <a href="platform.zowasel.com" class="highlightbg bold a" style="Font-family: 'Radio Canada', sans-serif; padding: 15px 35px; letter-spacing: 1.5px; font-size: 14px; border-radius: 5px; color: #FFFFFF; text-decoration: none; background-color: #008D40; font-weight: 700; text-align: center;"><span class="a__text" style="Font-family: 'Radio Canada', sans-serif; color: #FFFFFF; text-decoration: none; text-align: center;">Login</span></a>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <div class="whitebg my-sm pb-0 px row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; padding-bottom: 0; padding: 12px 30px 5px; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="column col-sm-12" width="150" style="Font-family: 'Radio Canada', sans-serif;width: 25%; text-align: center" align="center" valign="top"> </td>
                                          <td class="column col-sm-12" width="300" style="Font-family: 'Radio Canada', sans-serif;width: 50%; text-align: center" align="center" valign="top">
                                            <div class="divider hr" style="Font-family: 'Radio Canada', sans-serif; margin: 0 auto; width: 100%; text-align: center;"> <!--[if mso | IE]> <table class="hr__table__ie" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; margin-right: auto; margin-left: auto; width: 100%; text-align: center;" width="100%" align="center">
                                                <tr style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                                  <td style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center"> <![endif]--> <table class="hr__table" role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                                      <tr class="hr__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                                        <td class="hr__cell" width="100%" align="center" valign="top" style="Font-family: 'Radio Canada', sans-serif; border-top: 1px solid #9A9A9A; text-align: center;">&nbsp;</td>
                                                      </tr>
                                                    </table> <!--[if mso | IE]> </td>
                                                </tr>
                                              </table> <![endif]--> </div>
                                          </td>
                                          <td class="column col-sm-12" width="150" style="Font-family: 'Radio Canada', sans-serif;width: 25%; text-align: center" align="center" valign="top"> </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <div class="whitebg pb row" style="Font-family: 'Radio Canada', sans-serif; background-color: #FFFFFF; padding-bottom: 20px; text-align: center;">
                                      <table class="row__table" width="100%" align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="Font-family: 'Radio Canada', sans-serif; table-layout: fixed; text-align: center;">
                                        <tr class="row__row" style="Font-family: 'Radio Canada', sans-serif; text-align: center;" align="center">
                                          <td class="column col-sm-12" width="600" style="Font-family: 'Radio Canada', sans-serif;width: 100%; text-align: center" align="center" valign="top">
                                            <p class="mb-xs text p" style="display: block; font-family: Helvetica,Arial,sans-serif; font-size: 16px; line-height: 20px; Font-family: 'Radio Canada', sans-serif; padding: 0; margin: 0; color: #616161; margin-bottom: 7px; text-align: center;">Thank you for choosing Zowasel</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table> <!--[if mso | IE]> </td>
                          </tr>
                        </table> <![endif]--> </div>
                    </td>
                  </tr>
                </table>
                <div style="Font-family: 'Radio Canada', sans-serif; display: none; white-space: nowrap; font-size: 15px; line-height: 0; text-align: center;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
              </body>
            </html>
            `);
    
           
        }

                    /* -------------------------- CREATE AND SAVE USER -------------------------- */
        });
        
        

        return res.status(200).json({
            error: false,
          message: 'Hubspot data uploaded successfully'
          
      })

    } catch (error) {
            

        return res.status(500).json({
            error: true,
          message: 'Unable to complete request at the moment' + '' + err.toString()
          
      });

    }
    }

    
    }


module.exports = HubspotController;