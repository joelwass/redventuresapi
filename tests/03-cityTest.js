/**
 * Created by joelwasserman on 10/2/16.
 */
'use strict'

var request = require('supertest');
var should = require('should');
var server = require('../app.js');


describe('User', function () {

    before(function (done) {
        done();
    });

    var latitude_from = 29.19191,
        latitude_to = 32.1921904,
        longitude_from = 12.12121,
        longitude_to = 21.121;

    it('should get cities between values', function (done) {

        var reqBody = {
            latitude_from: latitude_from,
            latitude_to: latitude_to,
            longitude_from: longitude_from,
            longitude_to: longitude_to,
        };

        request(server)
            .get('/cities')
            .expect('Content-Type', /json/)
            .send(reqBody)
            .end(function (err, res) {
                var json = JSON.parse(res.text);
                console.log(json);

                res.status.should.equal(200);
                var json = JSON.parse(res.text);
                json.success.should.equal(true);
                console.log(json);
                done();
            });

    });

});
