var appRoot = require("app-root-path");
const md5 = require("md5");
const { validationResult } = require("express-validator");
const { use } = require("~routes/api");
const { KYB, Company, ErrorLog } = require("~database/models");
const fs = require('fs');

class KYBController {
    static async startKybVerification(req, res) {

        const errors = validationResult(req);
        const body = req.body


        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                        });
                    }

                    //CREATE KYB RECORD
                    const userKyb = await KYB.create({
                        user_id: req.body.user_id,
                        tax_id: req.body.tax_id,
                        cac: req.body.cac,
                        financial_statement: req.body.financial_statement,
                        mou: req.body.mou
                    });

                    if (userKyb) {
                        return res.status(200).json({
                            error: false,
                            message: "Data Uploaded Successfully",
                        });
                    } else {
                        return res.status(400).json({
                            error: true,
                            message: "Could Not Upload Data",
                        });
                            }

                } catch (error) {
                    var logError = await ErrorLog.create({
                        error_name: "Error updating usre's document",
                        error_description: error.toString(),
                        route: "/api/admin/user/account/verifykycdocs",
                        error_code: "500"
                    });
                    if(logError){
                        return res.status(500).json({
                            error: true,
                            message: 'Unable to complete request at the moment' + " " + error.toString(),
                            
                        })
        
                    }
                }
            }
        }

module.exports = KYBController;