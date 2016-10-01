/**
 * Created by joelwasserman on 10/1/16.
 */

var _ = require('lodash');
var model = require('../api/models');
var helper = require('../api/helpers');

module.exports = {

    requireAuthentication: function (req, res, next) {

        var token = req.get('Auth');

        if (_.isUndefined(token)) {
            return res.status(401).json({ success: false, message: helper.strings.InvalidToken });
        }

        var findAccessTokenErr;
        model.User.verifyAccessToken(token)
            .then(function (decoded) {
                return model.User.findByAccessToken(decoded);
            })
            .then(function (user) {
                req.user = user;
            })
            .catch(function (err) {
                findAccessTokenErr = err;
                return res.status(400).json({ success: false, message: err });
            })
            .then(function () {
                if (findAccessTokenErr === undefined) {
                    next();
                }
            });
    },
};
