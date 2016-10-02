/**
 * Created by joelwasserman on 9/30/16.
 */

var helper = require('../helpers');
var model = require('../models');
var _ = require('lodash');
var fs = require('fs');
var parse = require('csv-parse');

module.exports = {

    /**
     * @swagger
     * definition:
     *   CityObject:
     *     properties:
     *       id:
     *         type: string
     *       state_id:
     *         type: integer
     *       name:
     *         type: string
     *       status:
     *         type: string
     *       latitude:
     *         type: double
     *       longitude:
     *         type: double
     *       createdAt:
     *         type: string
     *         format: date-time
     *       updatedAt:
     *         type: string
     *         format: date-time
     */

    /**
     * @swagger
     * definition:
     *   error400ReturnDescription:
     *     properties:
     *       success:
     *         type: boolean
     *       message:
     *         type: string
     */

    /**
     * @swagger
     * /state/{state}/cities:
     *   get:
     *     tags:
     *       - State
     *     description: This endpoint is used to get all cities for a state
     *       <table>
     *       </table>
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     parameters:
     *     - name: state
     *       description: The state id that you want to get all the cities
     *         for
     *       in: path
     *       schema:
     *         properties:
     *           state:
     *             type: integer
     *             required: true
     *         required:
     *           - state
     *     responses:
     *       200:
     *         description: Returns success with the data
     *         schema:
     *           properties:
     *             success:
     *               type: boolean
     *             results:
     *               type: array
     *               items:
     *                 $ref: '#/definitions/CityObject'
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

    getAllCities: function(req, res, next) {

        var body = _.pick(req.params, ['state']);
        if (_.keys(body).length != 1) {
            return res.status(400).json({ success: false, message: helper.strings.InvalidParameters });
        }

        console.log(body);
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