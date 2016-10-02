/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');
var fs = require('fs');
var parse = require('csv-parse');

module.exports = {

    getAllCities: function(req, res, next) {

        var body = _.pick(req.params, ['state']);
        if (_.keys(body).length != 1) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.state = parseInt(body.state);
        model.State.getAllCitiesForState(body, model)
            .then(function (localResults) {
                return res.status(200).json({ success: true, results: localResults });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },
};