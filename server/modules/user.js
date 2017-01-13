'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    cook: Boolean
}));
/**
 * Created by HP on 1/13/2017.
 */
