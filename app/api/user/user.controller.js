'use strict';

var DML = require('../../db_adapters/db_manipulation_layer');
var UserDmLayer = DML.user;
var WalletDmLayer = DML.wallet;
var WalletTransactionDmLayer = DML.transaction;

var userController = {};

userController.createUser = function ( req, res ) {
    var userObj = {};
    userObj.name = req.body.name;
    userObj.email = req.body.email;
    userObj.profile_image = req.body.profile_image;

    if(!userObj.email) return res.status(504).json({'message': 'email missing'});
    if(!userObj.name) return res.status(504).json({'message': 'name missing'});

    return UserDmLayer.createUser(userObj.name, userObj.email, userObj.profile_image)
        .then(function (user) {
            if(!user) throw 'user not created :(';
            userObj._id = user._id;
            return WalletDmLayer.createWallet(user._id);
        })
        .then(function (wallet) {
            if(!wallet) throw 'wallet not created :(';
            userObj.wallet_id = wallet._id;
            userObj.wallet_balance = wallet.wallet_balance;
            return res.status(200).json(userObj);
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
            return res.status(504).json({'message': 'something went wrong'});
        });
};

userController.makeTransaction = function ( req, res ) {
    console.log(req.body);
    var payer_user_id = req.body.payer_user_id;
    var payee_user_id = req.body.payee_user_id;
    var transaction_amount = req.body.transaction_amount;
    var transaction_comment = req.body.transaction_comment;

    return Promise.all([
            WalletDmLayer.getUserWallet(payer_user_id),
            WalletDmLayer.getUserWallet(payee_user_id)
        ])
        .then(function (wallets) {
            var payerWallet = wallets[0];
            if(!payerWallet) if(!wallet) throw 'payer wallet not found :(';

            var payeeWallet = wallets[1];
            if(!payeeWallet) if(!wallet) throw 'payee wallet not created :(';

            console.log("PAYER WALLET: ", payerWallet);
            console.log("PAYEE WALLET: ", payeeWallet);

            if(payerWallet.wallet_balance >= transaction_amount) {
                WalletTransactionDmLayer.makeTransaction(payerWallet._id, payeeWallet._id, transaction_amount, transaction_comment);
            } else {
                throw 'insufficient balance :(';
            }
        })
        .then(function (transaction) {
            console.log("TRANSACTION SUCCESSFUL");
            return res.status(200).json({"message": "transaction successfull"});
        })
        .catch(function (error) {
            console.log("ERROR: ", error);
            return res.status(504).json({'message': 'something went wrong'});
        })
};

module.exports = userController;