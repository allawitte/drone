'use strict';
let mongoose = require("mongoose");
let User = require('../server/modules/user');

//Подключаем dev-dependencies
var request = require('supertest');
let server = require('../index').server;
let app = require('../index').app;

describe('Fake request: When user resists', () => {
    // beforeEach(function (done) {
    //     server.close();
    //     done();
    // });
    it('it should not POST a user with no data', (done) => {
        // var user = {};
        // request("http://localhost:8000")
        //     .post('/register')
        //     .send(user)
        //     .expect(403)
        //     .expect('Wrong user data')
        //     .done();
        var user = { password : 'marcus', email : 'marcus@marcus.com'};

        request("http://localhost:8000")
            .post("/register")
            .send(user)
            .expect(200)
            .expect("marcus is stored", done);

    });
});

/**
 * Created by HP on 3/28/2017.
 */
