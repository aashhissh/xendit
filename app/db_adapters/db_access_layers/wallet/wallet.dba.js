'use strict';

var Promise = require('bluebird');
var Fawn = require("fawn");

var Wallet = require('../../../models').wallet;

//Promises
Promise.promisifyAll(Wallet);

// var task = Fawn.Task();
// task.initModel("wallet", Wallet);

var walletDbaLayer = {};

walletDbaLayer.createWallet = function (wallet) {
    return Wallet.createAsync(wallet);
};

walletDbaLayer.findWallet = function (user) {
    return Wallet.findOneAsync(user);
};

walletDbaLayer.makeTransaction = function (payer_wallet_id, payee_wallet_id, transaction_amount) {
    return Wallet.updateAsync({'_id': payer_wallet_id}, {$inc: {wallet_balance: -transaction_amount}})
        .then(function (update) {
            Wallet.updateAsync({'_id': payee_wallet_id}, {$inc: {wallet_balance: transaction_amount}})
        })
        .then(function (update) {
            return true;
        })
        .catch(function (error) {
            console.log("TRANSACTION ERROR", error);
            return false;
        })


    // return task.update("wallet", {_id: payer_wallet_id}, {$inc: {wallet_balance: -transaction_amount}})
    //     .update("wallet", {_id: payee_wallet_id}, {$inc: {wallet_balance: transaction_amount}})
    //     .run({useMongoose: true})
    //     .then(function () {
    //         return true;
    //     })
    //     .catch(function (error) {
    //         console.log("TRANSACTION ERROR", error);
    //         return false;
    //     })
};

walletDbaLayer.findWalletsByIds = function (query) {
    return Wallet.findAsync(query)
        .then(function (wallets) {
            return wallets;
        })
};

module.exports = walletDbaLayer;