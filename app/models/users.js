'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UsersSchema = new Schema({
    name:          { type: String },
    email:         { type: String, unique : true, required : true },
    profile_image: { type: String },
    created_at:    { type: Date, default: Date.now },
    updated_at:    { type: Date }
});

UsersSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

UsersSchema.pre('update', function (next) {
    var now = new Date();
    this.update({ 'updated_at': now });
    next();
});

module.exports = mongoose.model('Users', UsersSchema);