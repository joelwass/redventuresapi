/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

    createVisit: function (req, res, next) {

        var body = _.pick(req.body, ['city', 'state']);
        if (_.keys(body).length != 2
            || (typeof body.city != 'number')
            || (typeof body.state != 'number')
            || (req.query.user != req.user.id)
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.user_id = req.user.id;
        model.Visit.createNewVisit(body)
            .then(function (localVisit) {
                return res.status(200).json({ success: true, results: localVisit });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    getCitiesVisited: function (req, res, next) {

        var body = _.pick(req.query, ['user']);
        if (_.keys(body).length != 1
            || (typeof body.user != 'number')
            || (req.query.user != req.user.id)
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.user_id = body.user;
        model.Visit.findAllVisits(body)
            .then(function (localVisits) {

                var cityArray = [];
                var uniqueCities = _.uniqBy(localVisits, function(e) { return e.city_id });
                uniqueCities.forEach(function (currentValue, index, arr) {
                    cityArray.push(model.City.findCity(currentValue.city_id));

                    if (index + 1 == arr.length) {
                        return res.status(200).json({ success: true, results: cityArray });
                    }
                });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    getStatesVisited: function (req, res, next) {

        var body = _.pick(req.query, ['user']);
        if (_.keys(body).length != 1
            || (typeof body.user != 'number')
            || (req.query.user != req.user.id)
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.user_id = body.user;
        model.Visit.findAllVisits(body)
            .then(function (localVisits) {

                var stateArray = [];
                var uniqueStates = _.uniqBy(localVisits, function(e) { return e.state_id });
                uniqueStates.forEach(function (currentValue, index, arr) {
                    stateArray.push(model.State.findState(currentValue.state_id));

                    if (index + 1 == arr.length) {
                        return res.status(200).json({ success: true, results: stateArray });
                    }
                });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    deleteVisit: function (req, res, next) {

        var body = _.pick(req.query, ['user', 'visit']);
        if (_.keys(body).length != 2
            || (typeof body.user != 'number')
            || (typeof body.visit != 'number')
            || (req.query.user != req.user.id)
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.user_id = body.user;
        body.id = body.state;
        model.Visit.deleteVisit(body)
            .then(function (localVisit) {
                return res.status(200).json({ success: true, results: localVisit });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

};