/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

var models = require('../models');

module.exports = function (sequelize, DataTypes) {
    var Visit = sequelize.define('Visit', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            field: 'user_id',
        },
        state_id: {
            type: DataTypes.INTEGER,
            field: 'state_id',
        },
        city_id: {
            type: DataTypes.UUID,
            field: 'city_id',
        },
    }, {
        classMethods: {
            createNewVisit: function (body) {

                return Visit.create(body);
            },

            deleteVisit: function (body) {

                var params = { where: { id: body.id }};
                return Visit.destroy(params);
            },

            findAllVisits: function (body) {

                var params = { where: { user_id: body.user_id }};
                return Visit.findAll(params);
            },
        },
        instanceMethods: {

        },
    });

    return Visit;
};