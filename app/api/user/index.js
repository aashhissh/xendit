'use strict';

var express = require('express');
var userController = require('./user.controller');

var router = express.Router();

router.post( '/create', userController.createUser );

router.post( '/make_transaction', userController.makeTransaction );

router.get('/getall', userController.getAllUser );

module.exports = router;