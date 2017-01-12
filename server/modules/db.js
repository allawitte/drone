var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/drone');
var db = mongoose.connection;
var Schema = mongoose.Schema;
const menu = require('./menu');
var menuShema = new Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    id: {type: Number},
    rating: {type: Number},
    ingredients: {type: Array},
    price: {type: Number}
},{collection: 'menu'});
var menuList = mongoose.model('menu', menuShema);
var setMenu = function () {
    menu.forEach(item => {
        var data = new menuList(item);
        data.save(err => {
            console.log(err);
        });
    });
};
setMenu();

exports.db = db;
/**
 * Created by HP on 12/19/2016.
 */
