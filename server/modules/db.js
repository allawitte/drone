var mongoose = require('mongoose');
var config = require('../../config');

mongoose.connect(config.database); // connect to database
///mongoose.connect('mongodb://localhost/drone');
var db = mongoose.connection;

var menuList = require('./menulist');
var setMenu = function () {
    menu.forEach(item => {
        var data = new menuList(item);
        data.save(err => {
            console.log(err);
        });
    });
};
//setMenu();
var getMenu = function (req, res) {
    menuList.find(function (err, menu) {
        if (err) {
            res.status(403).send(err);
        }
        else {
            //console.log('menu', menu);
            res.status(200).json(menu);
        }
    });
};

exports.db = db;
exports.getMenu = getMenu;
/**
 * Created by HP on 12/19/2016.
 */
