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

describe('When user resists', () => {
    beforeEach(function (done) {
        server.close();
         done();
    });
    it('it should not POST a user with no data', (done) => {
        var user = {};
        chai.request(app)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(403);
                res.should.be.json;
                res.body.should.equal('Wrong user data');
                done();
            });
    });

    it('it should POST a user with correct data', (done) => {
        var user = {
            email: "myemail11@mail.com",
            password: "123456",
            cook: false,
            account: 0
        };
        chai.request(app)
            .post('/register')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            });
    });
    it('it should reject to POST a user with existing data', (done) => {
        var user = new User({
            email: "anny@mail.com",
            password: "jefhkf",
            cook: false,
            account: 0
        });
        var duplicatedUser = {
            email: "anny@mail.com",
            password: "123456",
            cook: true,
            account: 100
        };
        user.save((err, res)=> {
            chai.request(app)
                .post('/register')
                .send(duplicatedUser)
                .end((err, res) => {
                    res.should.have.status(433);
                    res.should.be.json;
                    res.body.message.should.equal('User already exists');
                    done();
                });
        });

    });
});
/**
 * Created by HP on 3/27/2017.
 */
