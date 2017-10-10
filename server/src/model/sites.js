"use strict";

var Sequelize = require("sequelize");
var bcrypt = require("bcrypt-nodejs");
var defer = require("node-promise").defer;


module.exports = function(sequelize, DataTypes) {
    var User = sequelize.import("./User");
    var Sites = sequelize.define('Sites', {
            id: {
                type: Sequelize.INTEGER(11),
                field: 'id',
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },

            date: {
                type: Sequelize.DATE,
                field: 'date',
                allowNull: false
            },

            domain: {
                type: Sequelize.STRING,
                field: 'domain',
                allowNull: true
            },

            data: {
                type: Sequelize.TEXT('long'),
                field: 'data',
                allowNull: false
            },

            score: {
                type: Sequelize.FLOAT(11),
                field: 'score',
                allowNull: true
            }
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
            tableName: 'sites',

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
    Sites.belongsTo(User, {
        foreignKey: 'userId'
    });

    Sites.getSitesByUserIdFromAdmin = function(userId) {
        var deferred = defer();

        Sites.findAll({
            where: {
                userId: userId.userId
            }
        }).then(result => {
            deferred.resolve(result);
        })
        return  deferred.promise;
    }

    //
    // Sites.findAll({
    //     where: {
    //         userId: params.id
    //     }
    // }) .then(result=> {
    //
    // }

    Sites.getSitesByUserId = function(params) {
        var deferred = defer();
        var userId = params.userId;
        var str = params.str;
        var limit = params.limit;
        var skip = params.skip;
        Sites.findAll({
            where: {
                domain: {
                    $like: "%"+str+"%"
                }
            },
            include: [{
                model: User,
                where: {'id': userId}
            }]
        }).then(sites => {
            Sites.findAll({
                limit: limit,
                offset: skip,
                where: {
                    domain: {
                        $like: "%"+str+"%"
                    }
                },
                include: [{
                    model: User,
                    where: {'id': userId}
                }],
                order: [
                    ['date', 'DESC']
                ]
            }).then(result => {
                deferred.resolve({
                    result: result,
                    count:  sites.length
                });
            })
        });
        return deferred.promise;
    }
    Sites.getSiteByUser = function(params) {
        var deferred = defer();
        var userId = params.userId;
        var siteId = params.siteId;
        Sites.find({
            include: [{
                model: User,
                where: {'id': userId}
            }],
            order: [
                ['date', 'DESC']

            ],
            where: {
                'Id': siteId
            }
        }).then(result => {
            deferred.resolve(result);
        })
        return deferred.promise;
    }

    Sites.deleteData = function(params) {
        var deferred = defer();
        var id = params.id;
        var userId = params.userId;
        Sites.destroy({
            where: {
                id: id
            }
        }).then(result => {
            if (result) {
                Sites.findAll({
                    where: {'userId': userId},
                    order: [
                        ['date', 'DESC']

                    ]
                }).then(result => {
                    deferred.resolve(result);
                })
            } else {
                deferred.resolve({error: "The site is not found"});
            }
        });
        return deferred.promise;
    }

    Sites.saveData = function(body, designScore, seoScore, accessibilityScore, performanceScore, contentScore, userId) {
        var deferred = defer();
        var allData = {};
        allData.data = body.data;
        allData.designScore = designScore;
        allData.seoScore = seoScore;
        allData.accessibilityScore = accessibilityScore;
        allData.performanceScore = performanceScore;
        allData.contentScore = contentScore;
        allData.valid = seoScore.score.perfect + designScore.score.perfect + contentScore.score.perfect + performanceScore.score.perfect + accessibilityScore.score.perfect;
        allData.warning = seoScore.score.good + designScore.score.good + contentScore.score.good + performanceScore.score.good + accessibilityScore.score.good;
        allData.critical = seoScore.score.bad + designScore.score.bad + contentScore.score.bad + performanceScore.score.bad + accessibilityScore.score.bad;
        var score = Math.ceil((parseInt(designScore.validDesign) + parseInt(seoScore.validSeo) + parseInt(accessibilityScore.validAccessibility) + parseInt(performanceScore.validPerformance)
            + parseInt(contentScore.validContent)) / 5);

        var userData = JSON.stringify(allData);
        var domain = JSON.stringify(body.domain);
        var date = Date.now();
        // var date = (date_.getMonth() + 1 ) + ":" + date_.getDate() + ":" + date_.getYear();
        User.find({id: userId}).then(function(user) {
            var userRegistratedDate = user.dataValues.registratedDate;
            // var dateCreated = userRegistratedDate.matches(/.+?(?=T)/g)
            var seoTries = user.dataValues.seoTries;

            Sites.create({
                userId: userId,
                data: userData,
                domain: domain,
                date: date,
                score: score
            }).then(result => {
                deferred.resolve(result);
            });
        });
        return deferred.promise;
    }
    return Sites;
};