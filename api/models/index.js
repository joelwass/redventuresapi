/**
 * Created by joelwasserman on 9/30/16.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var dbName = process.env.POSTGRES_DB;
var connection = new Sequelize(dbName, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_ENDPOINT,
    dialect: 'postgres',
    port:    5432,
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
        max: process.env.NODE_ENV === 'production' ? 50 : 25,
        min: 0,
        idle: 10000,
    },
    benchmark: true,
});
var db = {};

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
    var model = connection.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = connection;
db.Sequelize = Sequelize;

module.exports = db;