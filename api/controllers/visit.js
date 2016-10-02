/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = {

    /**
     * @swagger
     * definition:
     *   VisitObject:
     *     properties:
     *       id:
     *         type: string
     *       user_id:
     *         type: string
     *       state_id:
     *         type: integer
     *       city_id:
     *         type: string
     */

    /**
     * @swagger
     * /user/{user}/visits:
     *   post:
     *     tags:
     *       - Visit
     *     description: This endpoint is used to create a visit
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: Auth
     *       in: header
     *       description: jwt
     *       required: true
     *       type: string
     *       format: string
     *     - name: body
     *       description: The email and password required to log
     *         in a user
     *       in: body
     *       schema:
     *         properties:
     *           city:
     *             type: string
     *             required: true
     *           state:
     *             type: string
     *             required: true
     *         required:
     *           - city
     *           - state
     *     responses:
     *       200:
     *         description: Returns success with the visit object
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             results:
     *               $ref: '#/definitions/VisitObject'
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
                body.city_id = city.dataValues.id;

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
                body.state_id = state.dataValues.id;

                return model.Visit.createNewVisit(body);
            })
            .then(function (localVisit) {
                return res.status(200).json({ success: true, results: localVisit });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });

    },

    /**
     * @swagger
     * /user/{user}/visits:
     *   get:
     *     tags:
     *       - City
     *     description: This endpoint is used to get the cities
     *       visited by a user
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: Auth
     *       in: header
     *       description: jwt
     *       required: true
     *       type: string
     *       format: string
     *     - name: body
     *       description: Just the user id to get all the cities visited
     *       in: path
     *       schema:
     *         properties:
     *           user:
     *             type: string
     *             required: true
     *         required:
     *           - user
     *     responses:
     *       200:
     *         description: Returns success with an array of cities visited
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             results:
     *               type: array
     *               items:
     *                 type: string
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
                var uniqueCities = _.uniq(localVisits, 'id');
                uniqueCities.forEach(function (currentValue, index, arr) {
                    model.City.findCity(currentValue.city_id)
                        .then(function (city) {
                            cityArray.push(city.name);

                            if (index + 1 == arr.length) {

                                return res.status(200).json({ success: true, results: cityArray });
                            }
                        })
                        .catch(function (err) {
                            return Promise.reject(err);
                        });
                });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    /**
     * @swagger
     * /user/{user}/visits/states:
     *   get:
     *     tags:
     *       - State
     *     description: This endpoint is used to get all states
     *       visited by a user
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: Auth
     *       in: header
     *       description: jwt
     *       required: true
     *       type: string
     *       format: string
     *     - name: body
     *       description: The user id to get all states visited
     *       in: path
     *       schema:
     *         properties:
     *           user:
     *             type: string
     *             required: true
     *         required:
     *           - user
     *     responses:
     *       200:
     *         description: Returns success with an array of states visited
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             results:
     *               type: array
     *               items:
     *                 type: string
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
                var uniqueStates = _.uniq(localVisits, 'id');
                uniqueStates.forEach(function (currentValue, index, arr) {
                    model.State.findState(currentValue.state_id)
                        .then(function (state) {
                            stateArray.push(state.name);

                            if (index + 1 == arr.length) {

                                return res.status(200).json({ success: true, results: stateArray });
                            }
                        })
                        .catch(function (err) {
                            return Promise.reject(err);
                        });
                });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

    /**
     * @swagger
     * /user/{user}/visit/{visit}:
     *   delete:
     *     tags:
     *       - Visit
     *     description: This endpoint is used to delete a visit
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: Auth
     *       in: header
     *       description: jwt
     *       required: true
     *       type: string
     *       format: string
     *     - name: body
     *       description: the user id and the visit id that is to be deleted
     *       in: path
     *       schema:
     *         properties:
     *           user:
     *             type: string
     *             required: true
     *           visit:
     *             type: string
     *             required: true
     *         required:
     *           - user
     *           - visit
     *     responses:
     *       200:
     *         description: Returns success with the user and an auth token
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
            .then(function () {
                return res.status(200).json({ success: true });
            })
            .catch(function (err) {
                return res.status(400).json({ success: false, message: err });
            });
    },

};