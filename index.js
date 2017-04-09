'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var User = require('./server/modules/user'); // get our mongoose model
var Order = require('./server/modules/order'); // get our mongoose model
const drone = require('netology-fake-drone-api');

mongoose.Promise = require('bluebird');



var config = require('./config'); // get our config file
var router = require('./router');

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
var orderChangeStatus =  function (req, res) {
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

app.put('/order/change-status', orderChangeStatus);

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
