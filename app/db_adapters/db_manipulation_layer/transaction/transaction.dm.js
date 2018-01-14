'use strict';

var DbATransaction = require('../../db_access_layers').transaction;
var DbmWallet = require('../wallet');

var transactionDmLayer = {};

transactionDmLayer.makeTransaction = function (payer_wallet_id, payee_wallet_id, transaction_amount, comment) {
    return DbmWallet.makeTransaction(payer_wallet_id, payee_wallet_id, transaction_amount)
        .then(function (transaction) {
            if(transaction) {
                var transactionObject = {};
                transactionObject.amount = transaction_amount;
                transactionObject.payee_wallet_id = payee_wallet_id;
                transactionObject.payer_wallet_id = payer_wallet_id;
                if(comment)
                    transactionObject.comment = comment;

                return DbATransaction.createTransaction(transactionObject);
            } else {
                throw 'transaction failed';
            }
        })
        .then(function (transaction) {
            return transaction;
        })
};

transactionDmLayer.getTransactionsForUserId = function (wallet_id, page_no) {
    var page_limit = 3;

    var orQuery = [];
    orQuery.push({'payee_wallet_id': wallet_id});
    orQuery.push({'payer_wallet_id': wallet_id});

    var query = {
        '$or': orQuery
    };

    var pagination = {
        page: page_no,
        limit: page_limit,
        sort: { created_at: -1 },
        select: 'amount payee_wallet_id payer_wallet_id comment created_at'
    };

    return DbATransaction.getWalletTransactions(query, pagination)
        .then(function (transactions) {
            return transactions;
        })
};

module.exports = transactionDmLayer;