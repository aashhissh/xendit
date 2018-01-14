'use strict';

var Promise = require('bluebird');
var User = require('../../../models').user;

//Promises
Promise.promisifyAll(User);

var userDbaLayer = {};

userDbaLayer.createUser = function (user) {
    return User.createAsync(user);
};

userDbaLayer.findUsersByUserIds = function (query) {
    return User.findAsync(query)
        .then(function (users) {
            return users;
        })
};

module.exports = userDbaLayer;