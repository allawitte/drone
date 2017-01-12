'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./modules/db.js');


app.use(express.static(__dirname));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || '8000');



app.listen(app.get('port'), function () {
    console.log('Express started on port http://localhost:' + app.get('port'));
});
/**
 * Created by HP on 12/19/2016.
 */
