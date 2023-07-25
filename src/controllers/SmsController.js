const express = require('express');
const { ErrorLog } = require("~database/models");
const app = express();
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const axios = require('axios');
const serveAdminid = require("~utilities/serveAdminId");
const {sendSmsSINGLE,sendSmsBATCH} = require("~services/sms")

SECRETKEY="tsk_nqiu638dd7127face02564zyyd"

class SmsController {
    /* ----------------------------- for single sms ----------------------------- */
    static async sendTheSms(req, res) {

        try{

        sendSmsSINGLE(req.body.phone,req.body.sms);
        /* ------------------------------ activity log ------------------------------ */
        var adminId = await  serveAdminid.getTheId(req);
                            
        await Activitylog.create({
        admin_id:adminId ,
        section_accessed:'Sending individual sms)',
        page_route:'/api/admin/sendgrid/sendsinglesms',
        action:'sent an sms'
    });
    //   end

        return res.status(200).json({
            error : false,
            message : "SMS sent successfully"
        });

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on sending sms",
            error_description: error.toString(),
            route: "/api/admin/sendgridsms/sendsinglesms",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+ "" + error.toString(),
                
            });
    }

    }

        
    }

    /* ------------------------------ for bulk sms ------------------------------ */
    static async sendBulkSms(req, res) {
        try{

        sendSmsBATCH(req.body.recipients,req.body.sms);

         /* ------------------------------ activity log ------------------------------ */
         var adminId = await  serveAdminid.getTheId(req);
                            
         await Activitylog.create({
         admin_id:adminId ,
         section_accessed:'Sending bulk sms',
         page_route:'/api/admin/sendgridsms/sendbulksms',
         action:'Sent bulk sms '
     });
     //   end

        return res.status(200).json({
            error : false,
            message : " BULK SMS sent successfully"
        });

    }catch(error){
        var logError = await ErrorLog.create({
            error_name: "Error on sending bulk sms",
            error_description: error.toString(),
            route: "/api/admin/sendgridsms/sendbulksms",
            error_code: "500"
        });
        if(logError){
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'+ "" + error.toString(),
                
            });
    }

        
    }
}

}
module.exports = SmsController;
