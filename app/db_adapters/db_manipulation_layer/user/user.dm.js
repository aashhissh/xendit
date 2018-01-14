'use strict';

var DbaUser = require('../../db_access_layers').user;

var userDmLayer = {};

userDmLayer.createUser = function (name, email, profilePicture) {
    var userObject = {};

    userObject.name = name;
    userObject.email = email;

    if(profilePicture)
        userObject.profile_image = profilePicture;

    return DbaUser.createUser(userObject)
        .then(function (user) {
            return user;
        })
};

userDmLayer.findUsersByUserIds = function (userIds) {
    var query = {
        _id: { '$in': userIds }
    };

    return DbaUser.findUsersByUserIds(query)
        .then(function (users) {
            return users;
        })
};

module.exports = userDmLayer;