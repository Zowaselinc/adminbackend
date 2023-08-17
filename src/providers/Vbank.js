require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
const { Loan } = require('~database/models');
const { generateRandom } = require('~utilities/string');
const md5 = require('md5');
const BASE_URL = process.env.VBANK_BASE_URL;
const TOKEN = process.env.VBANK_ACCESS_TOKEN;
const WALLET_CREDENTIALS = process.env.VBANK_WALLET_CREDENTIALS;
class Vbank {

    constructor() {
        this.axios = axios.create({
            baseURL: BASE_URL,
            params: {
                "wallet-credentials": WALLET_CREDENTIALS
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
    }

    async getBankList() {

        const path = "/bank";

        let errorResponse;

        const response = await this.axios.get(path).catch((error) => {
            errorResponse = error.response.data
        });

        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };

    }

    async mainAccountEnquiry() {
        return (await this.accountEnquiry());
    }


    async accountEnquiry(accountNumber) {

        const path = `account/enquiry`;

        const params = accountNumber ? { accountNumber } : {};

        let errorResponse;

        const response = await this.axios.get(path, { params }).catch((error) => {
            errorResponse = error.response.data
        });

        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };
    }


    async getBeneficiaryDetails(data) {

        const transferType = data.bank_code == "999999" ? "intra" : "inter";

        const path = `transfer/recipient`;

        const params = {
            accountNo: data.account_number,
            bank: data.bank_code,
            transfer_type: transferType
        };

        let errorResponse;

        const response = await this.axios.get(path, { params }).catch((error) => {
            errorResponse = error.response.data
        });

        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };
    }

    async createClientAccount(clientData) {
        const date = new Date(clientData.dob);
        const formattedDateSplit = date.toUTCString().split(" ");
        const formattedDate = `${formattedDateSplit[1]}-${formattedDateSplit[2]}-${formattedDateSplit[3]}`;

        const params = {
            dateOfBirth: formattedDate, // DD-MMM-YYYY Eg. 01-Oct-1988
            bvn: clientData.bvn
        };

        const path = "client/create";

        let errorResponse;

        const response = await this.axios.post(path, {}, { params }).catch((error) => {
            errorResponse = error.response.data
        });


        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };

    }


    async transferToAccount(wallet, accountNumber, amount, bank = "999999") {
        const fromAccount = (await this.accountEnquiry(wallet.account_number)).data;

        if (accountNumber == "default") {
            var toAccount = (await this.accountEnquiry()).data
        } else {
            var toAccount = bank == "999999"
                ? (await this.accountEnquiry(accountNumber)).data
                : (await this.getBeneficiaryDetails({
                    bank_code: bank,
                    account_number: accountNumber
                })).data;
        }



        if (Number.parseFloat(fromAccount.accountBalance) < amount) {
            return false;
        }

        var sha = crypto.createHash('sha512').update(`${fromAccount.accountNo}${toAccount.accountNo ?? toAccount.account.number}`);
        var transferSignature = sha.digest('hex');
        const ref = md5((new Date()).getTime() + generateRandom(10));
        const postBody = {
            fromAccount: fromAccount.accountNo,
            fromClientId: fromAccount.clientId,
            fromClient: fromAccount.client,
            fromSavingsId: fromAccount.accountId,
            toClientId: toAccount.clientId,
            toClient: toAccount.client ?? toAccount.name,
            toSavingsId: toAccount.accountId,
            toAccount: toAccount.accountNo ?? toAccount.account.number,
            toBank: bank,
            signature: transferSignature,
            amount: amount,
            remark: "trf download",
            transferType: bank == "999999" ? "intra" : "inter",
            reference: "Zowaseloans-" + ref
        }

        const path = "transfer";

        let errorResponse;

        const response = await this.axios.post(path, postBody).catch((error) => {
            errorResponse = error.response.data
        });

        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };

    }


    async disburseLoan(userId, accountNumber, amount, duration) {

        const transactionId = md5((new Date()).getTime() + generateRandom(10));

        const postBody = {
            transactionId: transactionId,
            "accountNo": accountNumber,
            "amount": amount,
            "duration": duration // 3 - 12
        }

        const path = "loan/create-and-disburse";

        let errorResponse;

        const response = await this.axios.post(path, postBody).catch((error) => {
            errorResponse = error.response.data
        });

        if (!errorResponse) {
            const loan = await Loan.create({
                user_id: userId,
                amount: amount,
                duration: duration,
                account_number: accountNumber,
                loan_account: response?.data.data.loanAccountNumber,
                tranasction_id: transactionId,
                status: "active"
            });
        }

        if (errorResponse) {
            return {
                error: true,
                data: errorResponse
            }
        }

        return {
            error: false,
            data: response?.data?.data
        };

    }

}

const VbankProvider = new Vbank();
module.exports = VbankProvider;

