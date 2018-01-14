'use strict';

var mongoosePaginate = require('mongoose-paginate');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionsSchema = new Schema({
    amount:            { type: Number },
    payee_wallet_id:   { type: Schema.Types.ObjectId },
    comment:           { type: String, default: '' },
    payer_wallet_id:   { type: Schema.Types.ObjectId },
    updated_at:        { type: Date },
    created_at:        { type: Date, default: Date.now }
});

TransactionsSchema.pre('save', function(next){
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

TransactionsSchema.pre('update', function (next) {
    var now = new Date();
    this.update({ 'updated_at': now });
    next();
});

TransactionsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transactions', TransactionsSchema);