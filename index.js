'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.Promise = require('bluebird');



var config = require('./config'); // get our config file
var router = require('./router');
var setMenu = require('./server/modules/menulist').setMenu;
setMenu();

app.set('port', process.env.PORT || config.port);
//mongoose.connect(config.database); // connect to database


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var db = require('./server/modules/db.js');

app.use(morgan('dev'));

var server = http.listen(app.get('port'), function () {
    console.log('Server starts on port 8000');
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
    res.render('index.html');
});


app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/menu', router.getMenuList);
app.post('/register', router.checkUserExistence);
app.post('/register', router.createUser);

app.get('/user/:clientId', router.getUserById);

app.put('/user/topup/:clientId', router.topUpUserAccount);

app.put('/user/refund/:clientId', router.refundPayment);

app.post('/auth', router.userAuth);

app.post('/order', router.postOrder);

app.put('/order/change-status', router.orderChangeStatus);

app.get('/order/:clientId', router.getOrderByClientId);

app.get('/cook/order', router.cookOrders);

app.get('/discount/:clientId', router.getUndeliveredOrdersForClient);

app.put('/refund/:orderId', router.disActivateDiscount);

// io.sockets.on('connection', function (socket) {
//     console.log('io connection');
//     socket.emit('order', { hello: 'world' });
//     socket.on('my other event', function (data) {
//         console.log('socket.io data', data);
//     });
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });
module.exports = {
    server : server,
    app : app
};


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
