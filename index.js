'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
mongoose.Promise = require('bluebird');
const drone = require('netology-fake-drone-api');


var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./server/modules/user'); // get our mongoose model
var Order = require('./server/modules/order'); // get our mongoose model

app.set('port', process.env.PORT || '8000');
//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var db = require('./server/modules/db.js');
var menuList = require('./server/modules/menulist');

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render('index.html');
});


app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());

// app.use('/order/*', function(req, res, next){
//     console.log('order', req.params);
//     next();
// });


app.get('/menu', function (req, res) {
    db.getMenu(req, res)
});

app.post('/register', function (req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        cook: false,
        account: 0
    });
    User.find({email: req.body.email}, function (err, users) {
        if (users.length == 0) {
            newUser.save(
                function (err) {
                    if (err) throw err;

                    console.log('User saved successfully');
                    res.json({success: true, status: 200});
                });
        }
        else {
            console.log('User alreay exists');
            res.status(403).json({message: 'User already exists'});
        }
    })
});

app.get('/user/:clientId', function (req, res) {
    var clientId = req.params.clientId;
    if (clientId !== 'undefined'){
        var mongooseId = new mongoose.mongo.ObjectId(clientId);
        User.find({_id: mongooseId}, function (err, users) {
            res.json(users);
        });
    }
});

app.put('/user/topup/:clientId', function (req, res) {
    var clientId = req.params.clientId;
    var mongooseId = new mongoose.mongo.ObjectId(clientId);
    User.findOneAndUpdate({_id: mongooseId}, {$inc: {account: req.body.account}}, {new: true}, function (err, user) {
        if (!err) {
            res.json(user);
        }
        else {
            res.json(err);
        }
    });

});

app.post('/auth', function (req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function (err, user) {
        if (user) {
            console.log('User exists');
            console.log(app.get('superSecret'));
            var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 1440 // expires in 24 hours
            });

            // return the information including token as JSON
            res.status(200).json({
                success: true,
                user: user._id,
                token: token
            });
        }

        else {
            console.log('User do not exists');
            res.status(404).json({message: 'User do not exists'});
        }
    });
});

app.post('/order', function (req, res) {
    var newOrder = new Order({
        userId: req.body.userId,
        dishId: req.body.dishId,
        status: 0,
        time: [req.body.time]
    });
    var mongooseId = new mongoose.mongo.ObjectId(req.body.userId);
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

});

app.put('/order/change-status', function (req, res) {
    console.log('req', req.body);
    var id = req.body._id;
    var status = req.body.status;

    Order.findOne({_id: id}, function (err, foundOrder) {
        if (err) {
            res.status(500).send();
        }
        else {
            foundOrder.status = status;
            foundOrder.time.push(new Date());
            foundOrder.save(function (err, updatedObject) {
                if (err) {
                    res.status(500).send();
                }
                else {
                    if (status == 2) {
                        drone
                            .deliver()
                            .then(() => {
                                console.log('Доставлено');
                                updatedObject.status = 3;
                                updatedObject.time.push(new Date());
                                updatedObject.save(function (err, savedObject) {
                                    if (err) {
                                        console.log('err', err)
                                    }
                                    else {
                                        console.log('savedObject', savedObject);
                                    }
                                });
                            })
                            .catch(() => {
                                console.log('Возникли сложности');
                                updatedObject.status = 4;
                                updatedObject.time.push(new Date());
                                updatedObject.save(function (err, savedObject) {
                                    if (err) {
                                        console.log('err', err)
                                    }
                                    else {
                                        console.log('savedObject', savedObject);
                                    }
                                });
                            });
                    }
                    res.json({data: updatedObject, status: 200});
                }
            })
        }
        console.log('updated', foundOrder);
    });

});
var mongojs = require('mongojs');

var dbjs = mongojs('drone', ['menu', 'orders', 'users']);

app.get('/order/:clientId', function (req, res) {
    var clientId = req.params.clientId;
    console.log('clientId', clientId);
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
                console.log(result);
                res.status(200).json(result);
            }
        }
    )
});

app.get('/cook/order', function (req, res) {
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
                //console.log(result);
                res.status(200).json(result);
            }
        }
    );

    // Order.find({status: {"$lte": 0}}, function (err, orders) {
    //     console.log('orders', orders);
    //     orders.forEach(function(item.id){
    //         Menu.findOne({id: item.id}, function (err, dish) {
    //             console.log('dish', dish);
    //         });
    //     }
    //     )
    // });
});



// var server = http.createServer();
//
// io = io.listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log('socket.io data', data);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.listen(app.get('port'), function () {
    console.log('Express started on port http://localhost:' + app.get('port'));
});
/**
 * Created by HP on 12/19/2016.
 */
