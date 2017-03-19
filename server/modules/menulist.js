'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const menu = require('./menu');
var menuShema = new Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    id: {type: Number},
    rating: {type: Number},
    ingredients: {type: Array},
    price: {type: Number}
}, {collection: 'menu'});

var menuList = mongoose.model('menu', menuShema);
module.exports = menuList;
/**
 * Created by HP on 3/12/2017.
 */
