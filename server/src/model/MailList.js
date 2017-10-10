"use strict";

var Sequelize = require("sequelize");
var bcrypt = require("bcrypt-nodejs");
var defer = require("node-promise").defer;
var config = require('../../config/config');

module.exports = function(sequelize, DataTypes) {
    var MailList = sequelize.define('MailList', {
            id: {
                type: Sequelize.INTEGER(11),
                field: 'id',
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },

            username: {
                type: Sequelize.STRING,
                field: 'username',
                allowNull: false
            },

            email: {
                type: Sequelize.STRING,
                field: 'email',
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                field: 'date',
                allowNull: false
            },
        },
        {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,

            charset: 'utf8',
            collate: 'utf8_unicode_ci',

            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: false,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,

            // define the table's name
            tableName: 'maillist',

            classMethods: {
                generateHash: function(password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                }
            },
            instanceMethods: {
                verifyPassword: function(password) {
                    return bcrypt.compareSync(password, this.password);
                }
            }
    });

    MailList.saveMailList = function(username, email) {
        var deferred = defer();
        var date = Date.now();
        MailList.create({
            username: username,
            email: email,
            date: date
        }).then(result => {
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    return MailList;
};