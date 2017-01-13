'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('./server/modules/db.js');


app.use(express.static(__dirname + '/public'));

app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || '8000');

app.get('/menu', function (req, res) {
    db.getMenu(req, res)
});


app.listen(app.get('port'), function () {
    console.log('Express started on port http://localhost:' + app.get('port'));
});
/**
 * Created by HP on 12/19/2016.
 */
