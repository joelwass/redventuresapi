/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');

module.exports = {

    /**
     * @swagger
     * definition:
     *   UserObject:
     *     properties:
     *       id:
     *         type: string
     *       first_name:
     *         type: string
     *       last_name:
     *         type: string
     *       email:
     *         type: string
     *       password:
     *         type: string
     */

    /**
     * @swagger
     * /user:
     *   get:
     *     tags:
     *       - User
     *     description: This endpoint is used to login a user
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: body
     *       description: The email and password required to log
     *         in a user
     *       in: body
     *       schema:
     *         properties:
     *           email:
     *             type: string
     *             required: true
     *           password:
     *             type: string
     *             required: true
     *         required:
     *           - email
     *           - password
     *     responses:
     *       200:
     *         description: Returns success with the user and an auth token
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             user:
     *               $ref: '#/definitions/UserObject'
     *             refreshToken:
     *               type: string
     *       400:
     *         description: An error occured that we are aware of, and we
     *           return a reason for the error that can be fixed
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     *       500:
     *         description: Something we aren't aware of went wrong with our
     *           server
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     */

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
                return model.User.createAndSaveRefreshToken(user.id, model);
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

    /**
     * @swagger
     * /user:
     *   post:
     *     tags:
     *       - User
     *     description: This endpoint is used to create a user
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: body
     *       description: The email and password required to create a user
     *         along with their first and last name
     *       in: body
     *       schema:
     *         properties:
     *           email:
     *             type: string
     *             required: true
     *           password:
     *             type: string
     *             required: true
     *           first_name:
     *             type: string
     *             required: true
     *           last_name:
     *             type: string
     *             required: true
     *         required:
     *           - email
     *           - password
     *           - first_name
     *           - last_name
     *     responses:
     *       200:
     *         description: Returns success with the user
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             results:
     *               $ref: '#/definitions/UserObject'
     *       400:
     *         description: An error occured that we are aware of, and we
     *           return a reason for the error that can be fixed
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     *       500:
     *         description: Something we aren't aware of went wrong with our
     *           server
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     */

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

    /**
     * @swagger
     * /user:
     *   delete:
     *     tags:
     *       - User
     *     description: This endpoint is used to delete a user
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: body
     *       description: The email and password required to log
     *         in a user are also required to delete a user
     *       in: body
     *       schema:
     *         properties:
     *           email:
     *             type: string
     *             required: true
     *           password:
     *             type: string
     *             required: true
     *         required:
     *           - email
     *           - password
     *     responses:
     *       200:
     *         description: Returns success
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *       400:
     *         description: An error occured that we are aware of, and we
     *           return a reason for the error that can be fixed
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     *       500:
     *         description: Something we aren't aware of went wrong with our
     *           server
     *         schema:
     *           $ref: '#/definitions/error400ReturnDescription'
     */

    deleteUser: function (req, res, next) {

        var body = _.pick(req.body, ['email', 'password']);
        if (_.keys(body).length != 2
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