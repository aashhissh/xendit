'use strict';

var Promise = require('bluebird');
var Transactions = require('../../../models').transaction;

//Promises
Promise.promisifyAll(Transactions);

var transactionDbaLayer = {};

transactionDbaLayer.createTransaction = function (transaction) {
    return Transactions.createAsync(transaction);
};

transactionDbaLayer.getWalletTransactions = function (query, paginationQuery) {
    return Transactions.paginate(query, paginationQuery)
        .then(function (results) {
            return results;
        })
};

module.exports = transactionDbaLayer;