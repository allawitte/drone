'use strict';
let mongoose = require("mongoose");
let User = require('../server/modules/user');

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').server;
let app = require('../index').app;
let should = chai.should();

chai.use(chaiHttp);
//Наш основной блок

describe('When user top up his account', () => {
    beforeEach(function (done) {
        server.close();
        done();
    });

    it('it should increase users account on 100', (done) => {
        var userAccount = 0;
        let user = new User({email: 'some-mail@email.com', password: '123456', cook: false, account: userAccount});

        user.save((err, res) => {
            var updatedUser = {
                email: res.email,
                password: res.password,
                cook: res.cook,
                account: res.account + 100
            };
            chai.request(app)
                .put('/user/topup/' + user.id)
                .send(updatedUser)
                .end((err, res) => {
                    console.log('res.body', res.body);
                    console.log('res.status', res.status);
                    res.should.have.status(200);
                    // res.should.be.json;
                    // res.body.should.equal('Wrong user data');
                    done();
                });
        });

    });
});
/**
 * Created by HP on 3/27/2017.
 */
