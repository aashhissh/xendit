'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Fawn = require("fawn");

var WalletsSchema = new Schema({
    user_id:        { type: Schema.Types.ObjectId },
    wallet_balance: { type: Number, default: 1000 },
    updated_at:     { type: Date },
    created_at:     { type: Date, default: Date.now }
});

WalletsSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

WalletsSchema.pre('update', function (next) {
    var now = new Date();
    this.update({ 'updated_at': now });
    next();
});

module.exports = mongoose.model('Wallets', WalletsSchema);