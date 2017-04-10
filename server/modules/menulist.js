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
var setMenu = function () {
    menuList.find({}, function (err, menulist) {
        if (err) {
            console.log('error to connect with menu collection');
            return;
        }
        if (menulist.lenth == 0) {
            menu.forEach(item => {
                var data = new menuList(item);
                data.save(err => {
                    console.log(err);
                });
            });
        }
        console.log('menu collection already exists');
    })

};


module.exports = {
    menuList: menuList,
    setMenu: setMenu
};
/**
 * Created by HP on 3/12/2017.
 */
