/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

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

            getAllCitiesForState: function(body, model) {

                var params = { where: { 'state_id': body.state }};
                return model.City.find(params);
            },

            findState: function(body) {

                var params = { where: { 'id': body }};
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