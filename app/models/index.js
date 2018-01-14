'use strict';

var Models = {};

Models.user = require('./users');
Models.wallet = require('./wallets');
Models.transaction = require('./transactions');

module.exports = Models;