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

    it('should create lux value', function (done) {

        var reqBody = {
            user_email: userEmail,
            lux_value: 100,
            time_stamp: parseInt(new Date()/1000),
            outside: false,
        };

        console.log(reqBody);
        request(server)
            .post('/api/v1/lux/')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.data.user_email.should.equal(userEmail);
                done();
            });

    });

    it('should not create lux value b/c bad params', function (done) {

        // params missing outside key
        var reqBody = {
            user_email: userEmail,
            lux_value: 200,
            time_stamp: new Date()/1000,
        };

        request(server)
            .post('/api/v1/lux/')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(400);
                var json = JSON.parse(res.text);
                json.success.should.equal(false);
                json.message.should.equal(helper.strings.InvalidParameters)
                done();
            });

    });

    it('should create lux value in past', function (done) {

        var reqBody = {
            user_email: userEmail,
            lux_value: 100,
            time_stamp: new Date()/1000 - 1000000,
            outside: false,
        };

        request(server)
            .post('/api/v1/lux/')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.data.user_email.should.equal(userEmail);
                done();
            });

    });

    it('should get all lux values', function (done) {

        request(server)
            .get('/api/v1/lux/')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.data.length.should.equal(2);
                done();
            });

    });

    it('should get all lux values after date', function (done) {

        var reqBody = {
            time_stamp: new Date()/1000 - 10000,
        };

        request(server)
            .get('/api/v1/lux/')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.data.length.should.equal(1);
                done();
            });

    });

    it('should delete lux values', function (done) {

        var reqBody = {
            user_email: userEmail,
            time_stamp_to: new Date()/1000,
            time_stamp_from: 0,
        };

        request(server)
            .delete('/api/v1/lux/')
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
