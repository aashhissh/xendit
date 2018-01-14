'use strict';

var DbaWallet = require('../../db_access_layers').wallet;
var DbmUser = require('../user');

var walletDmLayer = {};

walletDmLayer.createWallet = function (user_id) {
    var walletObject = {};
    walletObject.user_id = user_id;

    return DbaWallet.createWallet(walletObject)
        .then(function (wallet) {
            return wallet;
        });
};

walletDmLayer.getUserWallet = function (user_id) {
    var user = {'user_id': user_id};

    return DbaWallet.findWallet(user)
        .then(function (wallet) {
            return wallet;
        })
};

walletDmLayer.makeTransaction = function (payer_wallet_id, payee_wallet_id, transaction_amount) {
    return DbaWallet.makeTransaction(payer_wallet_id, payee_wallet_id, transaction_amount)
        .then(function (isTransactionSuccessful) {
            return isTransactionSuccessful;
        })
};

walletDmLayer.findUsersByWalletIds = function (wallet_ids) {
    var query = {
        _id: { '$in': wallet_ids }
    };

    var user_wallet_mapping = {};
    return DbaWallet.findWalletsByIds(query)
        .then(function (wallets) {
            var userIds = wallets.map(function (wallet) {
                user_wallet_mapping[wallet.user_id] = wallet._id;
                return wallet.user_id;
            });

            return DbmUser.findUsersByUserIds(userIds);
        })
        .then(function (users) {
            return users.map(function (user) {
                var object = {};
                object.name = user.name;
                object.profile_image = user.profile_image;
                object.wallet_id = user_wallet_mapping[user._id];
                return object;
            });
        })
};

module.exports = walletDmLayer;