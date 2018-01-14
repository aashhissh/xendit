'use strict';

var express = require('express');
var walletController = require('./wallet.controller');

var router = express.Router();

router.get( '/wallet_details/:user_id', walletController.getWalletDetails );

router.get('/wallet_transactions/:user_id/:page_no?', walletController.getWalletTransaction );

module.exports = router;