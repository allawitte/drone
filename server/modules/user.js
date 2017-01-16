'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    email: String,
    password: String,
    cook: Boolean,
    account: Number
},{collection: 'users'});

var User = mongoose.model('users', userSchema);

module.exports = User;
/**
 * Created by HP on 1/13/2017.
 */
