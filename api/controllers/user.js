/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

    login: function (req, res, next) {

        var body = _.pick(req.body, ['email', 'password']),
            user;
        if (_.keys(body).length != 2
            || (typeof body.email != 'string')
            || (typeof body.password != 'string')
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        model.User.authenticate(body)
            .then(function (localUser) {
                user = localUser;
                return model.User.createAndSaveRefreshToken(user.id);
            })
            .then(function (localRefreshToken) {
                refreshToken = localRefreshToken;
                return user;
            })
            .then(function (localUser) {
                const accessToken = model.User.createAccessToken(user.id);

                return res.header('Auth', accessToken)
                    .json({ success: true,
                        user: user.toJSON(),
                        refreshToken: refreshToken.token,
                    });

            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    createUser: function (req, res, next) {

        var body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name']);
        if (_.keys(body).length != 4
            || (typeof body.email != 'string')
            || (typeof body.password != 'string')
            || (typeof body.first_name != 'string')
            || (typeof body.last_name != 'string')
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        model.User.addNewUser(body)
            .then(function (localUser) {
                return res.status(200).json({ success: true, results: localUser });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    deleteUser: function (req, res, next) {

        var body = _.pick(req.body, ['email', 'password']);
        if (_.keys(body).length != 4
            || (typeof body.email != 'string')
            || (typeof body.password != 'string')
        ) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        model.User.deleteUser(body)
            .then(function (localUser) {
                return res.status(200).json({ success: true });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

};