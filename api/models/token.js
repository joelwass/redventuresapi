/**
 * Created by joelwasserman on 10/1/16.
 */
'use strict';

var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
    var Token = sequelize.define('Token', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            field: 'userId',
        },
        token: {
            type: DataTypes.VIRTUAL,
            validate: {
                len: [1],
            },
            set: function (value) {
                var hash = cryptojs.MD5(value).toString();
                this.setDataValue('token', value);
                this.setDataValue('tokenHash', hash);
            },
        },
        tokenHash: {
            type: DataTypes.STRING,
            field: 'tokenHash',
        },
    }, {
        indexes: [
            {
                method: 'BTREE',
                fields: ['userId'],
            },
        ],
    });

    return Token;
};

