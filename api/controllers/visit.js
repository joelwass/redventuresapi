/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

    createVisit: function (req, res, next) {

        var body = _.pick(req.body, ['city', 'state']);;
        if (_.keys(body).length != 2
            || (typeof body.city != 'string')
            || (typeof body.state != 'string')
            || (req.params.user != req.user.id)
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.user_id = req.user.id;
        model.City.findCityByName(body.city)
            .then(function (localCity) {
                if (localCity != undefined) {
                    return localCity;
                } else {

                    var newCityBody = {
                        name: body.city,
                    };
                    return model.City.addNewCity(newCityBody);
                }
            })
            .then(function (city) {
                body.city = city.id;

                return model.State.findStateByAbbreviation(body.state);
            })
            .then(function (localState) {
                if (localState != undefined) {
                    return localState;
                } else {

                     console.log('there was an error finding local state');
                }
            })
            .then(function (state) {
                body.state = state.id;

                return model.Visit.createNewVisit(body);
            })
            .then(function (localVisit) {
                return res.status(200).json({ success: true, results: localVisit });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });

    },

    getCitiesVisited: function (req, res, next) {

        var body = _.pick(req.params, ['user']);
        if (_.keys(body).length != 1
            || (typeof body.user != 'string')
            || (req.params.user != req.user.id)
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

        var body = _.pick(req.params, ['user']);
        if (_.keys(body).length != 1
            || (typeof body.user != 'string')
            || (req.params.user != req.user.id)
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

        var body = _.pick(req.params, ['user', 'visit']);
        if (_.keys(body).length != 2
            || (typeof body.user != 'string')
            || (typeof body.visit != 'string')
            || (req.params.user != req.user.id)
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