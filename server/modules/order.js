'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = Schema({
    userId: String,
    dishId: Number,
    status: Number,
    time: Date
},{collection: 'orders'});

var Order = mongoose.model('orders', orderSchema);

module.exports = Order;
/**
 * Created by HP on 1/14/2017.
 */
