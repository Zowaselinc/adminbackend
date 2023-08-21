const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Vfdwallet, ErrorLog, Activitylog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Mailer = require('~services/mailer');
const serveAdminid = require("~utilities/serveAdminId");
const md5 = require('md5');
const { EncryptConfig, DecryptConfig } = require("~utilities/encryption/encrypt");
const { mydb } = require("~utilities/backupdriver");
require('dotenv').config();
const axios = require('axios');
const VbankProvider = require("../providers/Vbank");
const { Loan } = require("../database/models");


class VfdwalletController {

    static async createVfdaccount(req, res) {
        const requestData = {

            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            dob: req.body.dob,
            address: req.body.address,
            gender: req.body.gender,
            phone: req.body.phone,
            bvn: req.body.bvn
        };
        // const c_key = `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`;
        // const base64Data = Buffer.from(c_key).toString('base64');
        // console.log(base64Data)

        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            }
        };


        axios.post(process.env.BASE_URL +
            "/wallet2/clientdetails/create?wallet-credentials=" + process.env.WALLET_CREDENTIALS,
            requestData, config)
            .then(response => {


                const responseData = response.data;
                const data = responseData.data;
                const accountNum = data.accountNo;

                let vfdWallet = Vfdwallet.create({
                    user_id: req.body.userid,
                    account_number: accountNum
                });
                if (vfdWallet) {
                    res.status(200).json({
                        error: false,
                        message: "Wallet created successfully",
                        data: { accountNo: accountNum }
                    })
                } else {
                    res.status(400).json({
                        error: true,
                        message: "Request failed"
                    })
                }


            })
            .catch(error => {
                // Handle any errors
                res.status(500).json({ error: 'An error occurred: ' + error });
            });
    }

    static async getVbankWallet(req, res) {
        try {
            const vWallet = req.query.user_type && (req.query.user_type == "farmer")
                ? await Vfdwallet.findOne({
                    where: { user_id: req.query.farmer_id, user_type: "farmer" }
                })
                : await Vfdwallet.findOne({
                    where: { user_id: req.global.user.id, user_type: "regular" }
                });


            if (vWallet) {
                const response = await VbankProvider.accountEnquiry(vWallet.account_number);

                if (response.error) {
                    return res.status(400).json({
                        error: true,
                        message: "Resource not available"
                    });
                }

                vWallet.balance = response.data.accountBalance;
                vWallet.dataValues.balance = response.data.accountBalance;
                vWallet.save();

                return res.status(200).json({
                    error: false,
                    data: vWallet,
                    message: "Wallet fetched successfully"
                });
            } else {
                return res.status(200).json({
                    error: false,
                    data: null,
                    message: "No VWallet found"
                });
            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error fetching vwallet",
                error_description: e.toString(),
                route: "/api/vwallet/",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
            }
        }
    }


    static async transferToAccount(req, res) {

        const vWallet = await Vfdwallet.findOne({ where: { user_id: req.body.farmer_id, user_type: "farmer" } })

        const response = req.body.bank
            ? await VbankProvider.transferToAccount(vWallet, req.body.account, req.body.amount, req.body.bank)
            : await VbankProvider.transferToAccount(vWallet, req.body.account, req.body.amount)

        if (response.error) {
            return res.status(400).json({
                error: true,
                data: response.data
            });
        }

        return res.status(200).json({
            error: false,
            message: "Transfer successful",
            data: response.data
        });
    }

    static async disburseLoan(req, res) {
        const vWallet = await Vfdwallet.findOne({ where: { account_number: req.body.account } });
        const response = await VbankProvider.disburseLoan(vWallet.user_id, req.body.account, req.body.amount, req.body.duration);

        if (response.error) {
            return res.status(400).json({
                error: true,
                data: response.data
            });
        }

        return res.status(200).json({
            error: false,
            message: "Loan disbursed successfully",
            data: response.data
        });
    }

    static async getLoans(req, res) {
        const loans = await Loan.findAll({ where: { account_number: req.query.account }, order: [['id', 'DESC']] });
        return res.status(200).json({
            error: false,
            message: "Loans fetched successfully",
            data: loans
        });
    }

    static async getMainAccount(req, res) {
        const account = await VbankProvider.accountEnquiry();
        return res.status(200).json({
            error: false,
            message: "Account fetched",
            data: account.data
        });
    }




}


module.exports = VfdwalletController;