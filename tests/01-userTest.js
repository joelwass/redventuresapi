/**
 * Created by joelwasserman on 10/1/16.
 */
'use strict'

var request = require('supertest');
var should = require('should');
var server = require('../app.js');
var helper = require('../api/helpers');


describe('Lux', function () {

    before(function (done) {
        done();
    });

    var userEmail = 'joel@test.com';
    var userPassword = 'testPass';
    var userFirstName = 'joel';
    var userLastName = 'wasserman';
    var auth;

    it('should create user', function (done) {

        var reqBody = {
            email: userEmail,
            password: userPassword,
            first_name: userFirstName,
            last_name: userLastName,
        };

        request(server)
            .post('/user')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.results.email.should.equal(userEmail);
                done();
            });

    });

    it('should not create user b/c bad params', function (done) {

        // params missing outside key
        var reqBody = {
            email: userEmail,
        };

        request(server)
            .post('/user')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(400);
                var json = JSON.parse(res.text);
                json.success.should.equal(false);
                done();
            });

    });

    it('should login user', function (done) {

        var reqBody = {
            email: userEmail,
            password: userPassword,
        };

        request(server)
            .get('/user')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                auth = res.headers.auth;
                should.exist(auth);
                done();
            });

    });

    it('should not login user', function (done) {

        var reqBody = {
            email: userEmail,
            password: 'badPassword',
        };

        request(server)
            .get('/user')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(400);
                var json = JSON.parse(res.text);
                json.success.should.equal(false);
                done();
            });

    });

    it('should delete user', function (done) {

        var reqBody = {
            email: userEmail,
            password: userPassword,
        };

        request(server)
            .delete('/user')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                done();
            });

    });

});
