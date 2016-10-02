/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

var models = require('../models');

module.exports = function (sequelize, DataTypes) {
    var State = sequelize.define('State', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            field: 'name',
        },
        abbreviation: {
            type: DataTypes.STRING,
            field: 'abbreviation',
        },
    }, {
        classMethods: {
            addNewState: function(body) {

                return State.create(body);
            },

            getAllCitiesForState: function(body) {

                var params = { where: { 'state_id': body.state_id }};
                return models.City.find(params);
            },

            findState: function(body) {

                var params = { where: { 'id': body.id }};
                return State.find(params);
            },

            findStateByAbbreviation: function(body) {

                var params = { where: { 'abbreviation': body }};
                return State.find(params);
            }
        },
        instanceMethods: {

        },
    });

    return State;
};