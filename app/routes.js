'use strict';

var api = '/api/';
var api_version_code = "v1";

var BASE_URL_USER = api + api_version_code + "/user/";
var BASE_URL_WALLET = api + api_version_code + "/wallet/";

module.exports = function (app) {
    try {
        app.use(BASE_URL_USER , require('./api/user'));
        app.use(BASE_URL_WALLET , require('./api/wallet'));
    } catch (err) {
        console.log(err);
    }
};