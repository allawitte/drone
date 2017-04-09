'use strict';
var express = require('express');
var app = express();
var router = express.Router();
var config = require('./config'); // get our config file
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User = require('./server/modules/user'); // get our mongoose model
var Order = require('./server/modules/order'); // get our mongoose model
var db = require('./server/modules/db.js');
var menuList = require('./server/modules/menulist');
const drone = require('netology-fake-drone-api');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongojs = require('mongojs');
var dbjs = mongojs('drone', ['menu', 'orders', 'users']);

app.set('superSecret', config.secret); // secret variable


function saveNewUser(req, res, newUser) {
    newUser.save(
        function (err, user) {
            if (err) {
                console.log('Can not save a user');
                throw err;
            }
            res.status(200).json({user});
        });
}

function updateStatus(updatedObject, status) {
    updatedObject.status = status;
    if(status == 4){
        updatedObject.discount = true;
    }
    if(status > 2) {
        updatedObject.time.push({status: status, moment: new Date()});
    }
    updatedObject.save(function (err, savedObject) {
        if (err) {
            console.log('err', err)
        }
        else {
            console.log('savedObject', savedObject);
            io.sockets.emit('order', savedObject);
        }
    });
}

function deliveryResult(updatedObject) {
    console.log('updatedObject', updatedObject);

    drone
        .deliver()
        .then(() => {
            console.log('Доставлено');
            updateStatus(updatedObject, 3);

        })
        .catch(() => {
            console.log('Возникли сложности');
            updateStatus(updatedObject, 4);
        });
}

router.getMenuList = function (req, res) {
    db.getMenu(req, res)
};

router.checkUserExistence = function (req, res, next) {
    if(!req.body.email || !req.body.password){
        console.log('User error');
        res.status('403').json('Wrong user data');
        return;
    }
    console.log('user email', req.body.email);
    User.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
            next();
        }
        else {
            res.status(433).json({message: 'User already exists'});
        }
    })
};

router.createUser = function (req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        cook: false,
        account: 0
    });
    saveNewUser(req, res, newUser);
};

router.getUserById = function (req, res) {
    var clientId = req.params.clientId;
    if (clientId !== 'undefined') {
        var mongooseId = new mongoose.mongo.ObjectId(clientId);
        User.findOne({_id: mongooseId}, function (err, user) {
            res.status(200).json(user);
        });
    }
    else res.status(404).send('user does not exist');
};

router.topUpUserAccount = function (req, res) {
    var clientId = req.params.clientId;
    var mongooseId = new mongoose.mongo.ObjectId(clientId);
    User.findOneAndUpdate({_id: mongooseId}, {$inc: {account: req.body.account}}, {new: true}, function (err, user) {
        if (err) {
            res.status(433).send('User does not exists');
        }
        else {
            res.status(200).json(user);
        }
    });

};

router.userAuth = function (req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function (err, user) {
        if (user) {
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 1440 // expires in 24 hours
            });

            res.status(200).json({
                success: true,
                user: user._id,
                token: token
            });
        }
        else {
            res.status(404).json({message: 'User do not exists'});
        }
    });
};

router.postOrder = function (req, res) {
    var newOrder = new Order({
        userId: req.body.userId,
        dishId: req.body.dishId,
        status: 0,
        time: [{status: 0, moment: req.body.time}],
        payment: req.body.payment
    });
    var mongooseId = new mongoose.mongo.ObjectId(req.body.userId);
    if (!req.body.userId) {
        res.status(403).send('no order to unregistered user');
    }
    User.findOne({_id: mongooseId}, function (err, user) {
        var userAccount = user.account;
        menuList.findOne({id: newOrder.dishId}, function (err, dish) {
            var dishPrice = dish.price;
            if (userAccount - dishPrice >= 0) {
                newOrder.save(function (err) {
                    if (err)throw err;
                    console.log('Order saved successfully');
                    res.status(200).json({success: true});
                    User.findOneAndUpdate({_id: mongooseId}, {$inc: {account: -dishPrice}}, {new: true}, function (err, user) {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(user.account);
                        }
                    });
                });
            }
            else {
                console.log('order is not saved. No money on account');
                res.status(415).json({success: false});
            }
        });

    });

};

router.orderChangeStatus =  function (req, res) {
    var id = req.body._id;
    var status = req.body.status;
    var time = req.body.time;
    if(status > 3) {
        time.push({status: status, moment: new Date()});
    }

    Order.findOneAndUpdate({_id: id}, {
        $set: {
            "status": status,
            "time": time
        }
    }, {new: true}, function (err, foundOrder) {
        if (err) {
            res.status(500).send('Error to update order: ' + id);
        }
        else {
            if (foundOrder.status == 2) {
                deliveryResult(foundOrder);
            }
            res.status(200).json({data: foundOrder});
        }

        io.sockets.emit('order', foundOrder);

        console.log('updated', foundOrder);
    });

};

router.getOrderByClientId = function (req, res) {
    var clientId = req.params.clientId;
    dbjs.orders.aggregate(
        {$match: {userId: clientId}}
        , {
            $lookup: {
                from: "menu",
                localField: "dishId",
                foreignField: "id",
                as: "dishes"
            }
        }
        , function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json(result);
            }
        }
    )
};

router.cookOrders = function (req, res) {
    dbjs.orders.aggregate(
        {$match: {'status': {"$lte": 2}}}
        , {
            $lookup: {
                from: "menu",
                localField: "dishId",
                foreignField: "id",
                as: "dishes"
            }
        }
        , function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json(result);
            }
        }
    );

};

router.disActivateDiscount = function(req, res){
    var mongooseId = new mongoose.mongo.ObjectId(req.params.orderId);
    Order.findOneAndUpdate({_id: mongooseId}, {$set: {discount: false}}, {new: true}, function (err, order){
       if(err){
           console.log(err);
       }
        else {
           res.status(200).json(order);
       }
    });
};

router.getUndeliveredOrdersForClient = function (req, res){
    var clientId = req.params.clientId;
    Order.find({userId: clientId, status: 4, discount: true}, function(err, orders){
        if(err){
            res.status(500).json(err);
        }
        console.log('orders', orders);
        res.status(200).json(orders);
    })
};

router.refundPayment = function(req, res){
    console.log('req.params.clientId', req.params.clientId);
    var mongooseId = new mongoose.mongo.ObjectId(req.params.clientId);
    var backToAccount = req.body.payment;

    User.findOneAndUpdate({_id: mongooseId}, {$inc: {account: backToAccount}}, {new: true}, function (err, user){
        res.status(200).json(user);
    })

};

module.exports = router;
/**
 * Created by HP on 3/26/2017.
 */
