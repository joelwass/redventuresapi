/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

    getAllCities: function(req, res, next) {

        var body = _.pick(req.query, ['state']);
        if (_.keys(body).length != 1
        || (typeof body.state != 'number')
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        body.state_id = body.state;
        model.State.getAllCitiesForState(body)
            .then(function (localResults) {
                return res.status(200).json({ success: true, results: localResults });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },
};