/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

var models = require('../models');

module.exports = function (sequelize, DataTypes) {
    var City = sequelize.define('City', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        state_id: {
            type: DataTypes.INTEGER,
            field: 'state_id',
        },
        name: {
            type: DataTypes.STRING,
            field: 'name',
        },
        status: {
            type: DataTypes.STRING,
            field: 'status',
        },
        latitude: {
            type: DataTypes.DOUBLE,
            field: 'latitude',
        },
        longitude: {
            type: DataTypes.DOUBLE,
            field: 'longitude',
        },
    }, {
        classMethods: {
            addNewCity: function(body) {

                return City.create(body);
            },

            findCity: function(body) {

                var params = { where: { 'id': body.id }};
                return City.find(params);
            },

            findCityByName: function(body) {

                var params = { where: { 'name': body }};
                return City.find(params);
            }
        },
        instanceMethods: {

        },
    });

    return City;
};

