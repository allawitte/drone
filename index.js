'use strict';
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./server/modules/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
app.set('port', process.env.PORT || '8000');
//mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var db = require('./server/modules/db.js');

app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.render('index.html');
});




app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/menu', function (req, res) {
    db.getMenu(req, res)
});


app.listen(app.get('port'), function () {
    console.log('Express started on port http://localhost:' + app.get('port'));
});
/**
 * Created by HP on 12/19/2016.
 */
