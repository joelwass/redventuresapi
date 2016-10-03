/**
 * Created by joelwasserman on 10/1/16.
 */
'use strict'

var request = require('supertest');
var should = require('should');
var server = require('../app.js');


describe('Visit', function () {

    before(function (done) {
        done();
    });

    var userEmail = 'joel@test.com';
    var userPassword = 'testPass';
    var userFirstName = 'joel';
    var userLastName = 'wasserman';
    var auth,
        userid,
        visitid;

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
                userid = json.results.id;
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

    it('should create visit', function (done) {

        var reqBody = {
            city: 'Chapel Hill',
            state: 'NC',
        };

        request(server)
            .post('/user/'+userid+'/visits')
            .set('Auth', auth)
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                visitid = json.results.id;
                done();
            });

    });

    it('should get all cities visited', function (done) {

        request(server)
            .get('/user/'+userid+'/visits')
            .set('Auth', auth)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                json.results[0].should.equal('Chapel Hill');
                done();
            });

    });

    it('should get all states visited', function (done) {

        request(server)
            .get('/user/'+userid+'/visits/states')
            .set('Auth', auth)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                done();
            });

    });

    it('should get all cities for state', function (done) {

        request(server)
            .get('/state/'+2+'/cities')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                done();
            });

    });

    it('should delete visit', function (done) {

        request(server)
            .delete('/user/'+userid+'/visit/'+visitid)
            .set('Auth', auth)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
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
