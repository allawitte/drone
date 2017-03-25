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

http.listen(8000, function () {
    console.log('Server starts on port 8000');
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.render('index.html');
});


app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/menu', function (req, res) {
    db.getMenu(req, res)
});

function saveNewUser(req, res, newUser) {
    newUser.save(
        function (err, user) {
            if (err) throw err;

            console.log('User saved successfully', user);
            res.status(200).json({user});
        });
}

app.use('/register', function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
            next();
        }
        else {
            res.status(433).json({message: 'User already exists'});
        }
    })
});
app.post('/register', function (req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        cook: false,
        account: 0
    });
    saveNewUser(req, res, newUser);
});

app.get('/user/:clientId', function (req, res) {
    var clientId = req.params.clientId;
    if (clientId !== 'undefined') {
        var mongooseId = new mongoose.mongo.ObjectId(clientId);
        User.findOne({_id: mongooseId}, function (err, user) {
            res.status(200).json(user);
        });
    }
    else res.status(404).send('user does not exist');
});

app.put('/user/topup/:clientId', function (req, res) {
    var clientId = req.params.clientId;
    var mongooseId = new mongoose.mongo.ObjectId(clientId);
    User.findOneAndUpdate({_id: mongooseId}, {$inc: {account: req.body.account}}, {new: true}, function (err, user) {
        if (!err) {
            res.status(433).send('User does not exists');
        }
        else {
            res.status(200).json(err);
        }
    });

});

app.post('/auth', function (req, res) {
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
});

app.post('/order', function (req, res) {
    var newOrder = new Order({
        userId: req.body.userId,
        dishId: req.body.dishId,
        status: 0,
        time: [{status: 0, moment: req.body.time}]
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

});

function updateStatus(updatedObject, status){
    updatedObject.status = status;
    updatedObject.time.push({status: status, moment: new Date()});
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

function deliveryResult(updatedObject){
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

app.put('/order/change-status', function (req, res) {
    var id = req.body._id;
    var status = req.body.status;
    var time = req.body.time.push({status: status, moment: new Date()});

    Order.findOne({_id: id}, function (err, foundOrder) {
        if (err) {
            res.status(500).send('Error to find order: '+id);
        }
        else {
            foundOrder.status = status;
            foundOrder.time.push({status: status, moment: new Date()});
            foundOrder.save(function (err, updatedObject) {
                if (err) {
                    res.status(500).send('Unable to save order updates id:', id);
                }
                else {
                    if (status == 2) {
                        deliveryResult(updatedObject);
                    }
                    res.status(200).json({data: updatedObject});
                }
            })
        }
        io.sockets.emit('order', foundOrder);

        console.log('updated', foundOrder);
    });

});
var mongojs = require('mongojs');

var dbjs = mongojs('drone', ['menu', 'orders', 'users']);

app.get('/order/:clientId', function (req, res) {
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

module.exports = app;


// io.sockets.on('connection', function (socket) {
//     console.log('io connection');
//     socket.emit('news', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log('socket.io data', data);
//     });
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });


// app.listen(app.get('port'), function () {
//     console.log('Express started on port http://localhost:' + app.get('port'));
// });
/**
 * Created by HP on 12/19/2016.
 */
