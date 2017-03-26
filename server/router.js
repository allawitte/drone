'use strict';
var express = require('express');
var router = express.Router();
var User = require('./modules/user'); // get our mongoose model
var Order = require('./modules/order'); // get our mongoose model
var db = require('./modules/db.js');
var menuList = require('./modules/menulist');

function saveNewUser(req, res, newUser) {
    newUser.save(
        function (err, user) {
            if (err) throw err;

            console.log('User saved successfully', user);
            res.status(200).json({user});
        });
}

router.getMenuList = function (req, res) {
    db.getMenu(req, res)
};

router.checkUserExistence = function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
            next();
        }
        else {
            res.status(433).json({message: 'User already exists'});
        }
    })
};

router.createUser =function (req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        cook: false,
        account: 0
    });
    saveNewUser(req, res, newUser);
};


module.exports = router;
/**
 * Created by HP on 3/26/2017.
 */
