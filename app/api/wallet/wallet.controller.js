'use strict';

var DML = require('../../db_adapters/db_manipulation_layer');
var UserDmLayer = DML.user;
var WalletDmLayer = DML.wallet;
var WalletTransactionDmLayer = DML.transaction;

var walletController = {};

var getAmountObject = function (amount, type) {
    var amountObject = {};
    amountObject.amount = Number(amount);
    amountObject.currency = "Rp";
    amountObject.amount_formatted = ((type === 'debit') ? ("-Rp " + amount) : ("Rp " + amount))
    amountObject.type = type;
    return amountObject;
};

var getAmountType = function (amount) {
    return amount && amount >= 0 ? "credit" : "debit";
};

var getDisplayTime = function (time) {
    var dateDiff = new Date() - new Date(time);
    var displayDate = "";

    if(dateDiff/1000 < 60) {
        displayDate = parseInt(dateDiff/1000) + " "  + "secs";
    } else if((dateDiff/60000) < 60) {
        displayDate = parseInt(dateDiff/60000) + " "  + "mins";
    } else if((dateDiff/3600000) < 60) {
        displayDate = parseInt(dateDiff/3600000) + " "  + "hrs";
    } else {
        displayDate = new Date(time).getFullYear() + " "  + new Date(time).getDay();
    }

    return displayDate;
};

walletController.getWalletDetails = function ( req, res ) {
    var user_id = req.params.user_id;
    if(!user_id) return res.status(504).json({'message': 'user_id missing'});

    return WalletDmLayer.getUserWallet(user_id)
        .then(function (wallet) {
            if(!wallet)
                throw 'user wallet not found :(';

            return res.status(200).json(getAmountObject(wallet.wallet_balance.toFixed(3), getAmountType(wallet.wallet_balance)));
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
            return res.status(504).json({'message': error});
        });
};

walletController.getWalletTransaction = function ( req, res ) {
    var user_id = req.params.user_id;
    var page_number = req.params.page_no ? req.params.page_no : 1;

    if(!user_id) return res.status(504).json({'message': 'user_id missing'});

    var transactionsResultObject = [];

    return WalletDmLayer.getUserWallet(user_id)
        .then(function (wallet) {
            if(!wallet)
                throw 'user wallet not found :(';

            return WalletTransactionDmLayer.getTransactionsForUserId(wallet._id, page_number)
                .then(function (transactions) {
                    if(transactions && transactions.docs && transactions.docs.length > 0) {
                        var walletIds = [];

                        transactions.docs.forEach(function (transaction) {
                            var isCurrentUserPayer = false;

                            if(transaction.payee_wallet_id.toString() === wallet._id.toString()) {
                                walletIds.push(transaction.payer_wallet_id);
                            } else {
                                isCurrentUserPayer = true;
                                walletIds.push(transaction.payee_wallet_id);
                            }

                            var transactionObject = {};
                            transactionObject.comment = transaction.comment;
                            transactionObject.display_time = getDisplayTime(transaction.created_at);

                            var amount = ((isCurrentUserPayer) ? (-transaction.amount) : (transaction.amount));
                            transactionObject.transaction_amount = getAmountObject(transaction.amount.toFixed(3), getAmountType(amount));
                            transactionObject.wallet_id_of_other_user = isCurrentUserPayer ? transaction.payee_wallet_id : transaction.payer_wallet_id;

                            transactionsResultObject.push(transactionObject);
                        });

                        return WalletDmLayer.findUsersByWalletIds(walletIds);
                    } else {
                        return res.status(200).json(transactionsResultObject);
                    }
                })
                .then(function (users) {
                    var resultObject = [];
                    transactionsResultObject.forEach(function (transactionResult) {
                        users.forEach(function (user) {
                            var object = {};
                            if(user.wallet_id.toString() === transactionResult.wallet_id_of_other_user.toString()) {
                                object = transactionResult;
                                object.user_name = user.name;
                                object.profile_image = user.profile_image;
                                resultObject.push(object)
                            }
                        })
                    });
                    return res.status(200).json(resultObject);
                });
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
            return res.status(504).json({'message': error});
        });
};

module.exports = walletController;