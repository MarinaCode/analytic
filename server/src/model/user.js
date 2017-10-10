"use strict";

var Sequelize = require("sequelize");
var bcrypt = require("bcrypt-nodejs");
var defer = require("node-promise").defer;
var htmlspecialchars = require('htmlspecialchars');
var utils = require('../../out/utils/utils');
var events = require('../../out/helpers/emitter');
var config = require('../../config/config');
var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var Packages = sequelize.import("./Packages");
    var MailList = sequelize.import("./MailList");
    var User = sequelize.define('User', {
            id: {
                type: Sequelize.INTEGER(11),
                field: 'id',
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },

            role: {
                type: Sequelize.INTEGER(11),
                field: 'role',
                allowNull: true
            },
            first_name: {
                type: Sequelize.STRING(50),
                field: 'first_name',
                allowNull: true
            },

            last_name: {
                type: Sequelize.STRING(50),
                field: 'last_name',
                allowNull: true
            },

            username: {
                type: Sequelize.STRING(50),
                field: 'username',
                allowNull: true
            },

            email: {
                type: Sequelize.STRING(50),
                field: 'email',
                allowNull: false
            },

            company: {
                type: Sequelize.STRING(50),
                field: 'company',
                allowNull: true
            },

            profession: {
                type: Sequelize.STRING(50),
                field: 'profession',
                allowNull: true
            },

            password: {
                type: Sequelize.TEXT,
                field: 'password',
                allowNull: true
            },

            country: {
                type: Sequelize.STRING(50),
                field: 'country',
                allowNull: true
            },

            birthDate: {
                type: Sequelize.STRING(50),
                field: 'birthDate',
                allowNull: true
            },

            phone: {
                type: Sequelize.STRING(10),
                field: 'phone',
                allowNull: true
            },

            registratedDate: {
                type: Sequelize.STRING(50),
                field: 'registratedDate',
                allowNull: true

            },

            lastCheck: {
                type: Sequelize.STRING(50),
                field: 'lastCheck',
                allowNull: true
            },

            gender: {
                type: Sequelize.INTEGER(50),
                field: 'gender',
                allowNull: true,
                defaultValue: 2
            },

            image: {
                type: Sequelize.TEXT,
                field: 'image',
                allowNull: true
            },

            activation_code: {
                type: Sequelize.TEXT,
                field: 'activation_code',
                allowNull: true
            },

            reset_password_code: {
                type: Sequelize.TEXT,
                field: 'reset_password_code',
                allowNull: true
            },

            activated: {
                type: Sequelize.INTEGER(1),
                field: 'activated',
                allowNull: true
            },

            emailType: {
                type: Sequelize.INTEGER(10),
                field: 'emailType',
                allowNull: true
            },

            checkerTries: {
                type: Sequelize.INTEGER(50),
                field: 'checkerTries',
                allowNull: true
            },

            seoTries: {
                type: Sequelize.INTEGER(50),
                field: 'seoTries',
                allowNull: true
            }
        },
        {
            // don't add the timestamp attributes (updatedAt, createdAt)
            timestamps: false,

            // don't delete database entries but set the newly added attribute deletedAt
            // to the current date (when deletion was done). paranoid will only work if
            // timestamps are enabled
            paranoid: true,

            // don't use camelcase for automatically added attributes but underscore style
            // so updatedAt will be updated_at
            underscored: true,

            // disable the modification of tablenames; By default, sequelize will automatically
            // transform all passed model names (first parameter of define) into plural.
            // if you don't want that, set the following
            freezeTableName: true,

            // define the table's name
            tableName: 'user',

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

    User.belongsTo(Packages, {
        foreignKey: 'productId'
    });
    User.getAllUsers = function(params) {
        var deferred = defer();
        User.findAll({
        }).then(result =>{
            if(result) {
                deferred.resolve(result);
            }

        })
        return deferred.promise;
    }

    /*
    * emailType :
    *   2 - facebook;
    *   1 - google ;
    *   0 - other ;
    * */
    User.getUserById = function(id) {
        var deferred = defer();
        User.find({
            where: {
                "id": id
            }
        }).then(result=> {
            if (result) {
                var result_ = {
                    id: result.id,
                    role: result.role,
                    username: result.username,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    email: result.email,
                    gender: result.gender,
                    country: result.country,
                    birthDate: result.birthDate,
                    company: result.company,
                    profession:result.profession,
                    phone: result.phone,
                    image: result.image,
                    registratedDate: result.registratedDate,
                    lastCheck: result.lastCheck,
                    emailType : result.emailType,
                    checkerTries: result.checkerTries,
                    seoTries: result.seoTries
                }
                deferred.resolve(result_);
            } else {
                deferred.reject({error: "User is not exist"});
            }
        })
        return deferred.promise;
    }

    User.resetPassword = function(email) {
        var deferred = defer();
        User.find({
            where: {
                "email": email
            }
        }).then(result => {
            if (result) {
                var user = {
                    reset_password_code: utils.encrypt(Math.round(Math.random()*Number.MAX_SAFE_INTEGER).toString(36))
                }
                User.update(user, {
                    where: {email: email}
                }).then(updatedData => {
                    if (updatedData) {
                        User.find({
                            where: {
                                "email": email
                            }
                        }).then(data => {
                            events.emit('sendMail:forgetPwd', {
                                first_name: data.first_name,
                                last_name: data.last_name,
                                email: data.email,
                                reset_password_code: data.reset_password_code
                            });
                            deferred.resolve({result: "ok"});
                        })
                    } else {
                        deferred.reject({error: 'Error occurs'});
                    }
                })
            } else {
                deferred.reject({error: 'User is not found'});
            }
        })
        return deferred.promise;
    }

    User.contactUs = function(email, username, subject, message) {
        var deferred = defer();
        var isValid = true;
        if (!utils.regEmail(email)) {
            isValid = false;
            deferred.reject({error: "Email is not correct"});
        } else if (username.trim().length == 0 || username.trim().length > 11) {
            isValid = false;
            deferred.reject({error: "Username is not correct"});
        } else if (subject.trim().length == 0 || subject.trim().length > 11) {
            isValid = false;
            deferred.reject({error: "Subject is not correct"});
        } else if (message.trim().length == 0 || message.trim().length > 101) {
            isValid = false;
            deferred.reject({error: "Message is required"});
        }
        if (isValid) {
            events.emit('sendMail:contact-us', {
                name: username,
                message: message,
                email: email,
                subject: subject
            });
            MailList.saveMailList(username, email).then(data=> {
                deferred.resolve({data: "ok"});
            })
        }
        return deferred.promise;
    }

    User.verifyPasswordCode = function(params) {
        var deferred = defer();
        var reset_password_code = params.reset_password_code;
        User.find({
            where: {
                "reset_password_code": reset_password_code
            }
        }).then(result => {
            if (!result) {
                deferred.reject({error: "The link is expired."});
            } else {
                deferred.resolve({result: "ok"});
            }
        });
        return deferred.promise;
    }

    User.updatePasswordByCode = function(body) {
        var deferred = defer();
        var reset_password_code = body.reset_password_code;
        User.find({
            where: {
                "reset_password_code": reset_password_code
            }
        }).then(result => {
            if (!result) {
                return deferred.reject({error: "The link is expired."});
            } else {
                var password = body.password;
                var confirmPassword = body.confirmPassword;
                var isPasswordValid = true;
                if (password.length < 8) {
                    isPasswordValid = false;
                } else if (password !== confirmPassword) {
                    isPasswordValid = false;
                }
                if (isPasswordValid) {
                    var _pass =  htmlspecialchars(password);
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            return deferred.reject({error: "Error occurs"});
                        } else {
                            bcrypt.hash(_pass, salt, null, (err, hash) => {
                                var updatedData = {reset_password_code: null};
                                updatedData.password = hash;
                                User.update(updatedData, {
                                    where: {reset_password_code: reset_password_code}
                                }).then((result_) => {
                                    if (result_) {
                                        deferred.resolve({result: "ok"});
                                    }
                                })
                            })
                        }
                    })
                } else {
                    deferred.reject({error: "Password is invalid"});
                }
            }
        });
        return deferred.promise;
    }

    User.activateEmail = function(params) {
        var deferred = defer();
        var activation_code = params.activation_code;
        User.find({
            where: {
                "activation_code": activation_code
            }
        }).then(result => {
            if (!result) {
                deferred.reject({error: "The link is expired."});
            } else {
                var updatedData = {
                    activated: 1,
                    activation_code: null
                }
                User.update(updatedData, {
                    where: {id: result.id}
                }).then((result) => {
                    deferred.resolve({result: "ok"});
                })
            }
        });
        return deferred.promise;
    }

    User.updatePassword = function(body, userId) {
        var deferred = defer();
        var isValidPass= true;
        var pass = body.pass;
        var confirm = body.confirm;
        var current = body.current;
        if (current != null) {
            if (current.length < 8) {
                isValidPass = false;
            } else {
                if (!pass && !confirm) {
                    isValidPass = false;
                }
            }
            if (pass !== confirm) {
                isValidPass = false;
            }
            if (isValidPass) {
                User.find({
                    where: {
                        "id": userId
                    }
                }).then(result=> {
                    if (result) {
                        bcrypt.compare(current, result.password, (err, res1) => {
                            if (!res1 && current) {
                                return deferred.reject({error: "Password is not match"});
                            } else {
                                var _pass = pass != null ? htmlspecialchars(pass) : htmlspecialchars(current);
                                bcrypt.genSalt(10, (err, salt) => {
                                    if (err) {
                                        deferred.reject({error: "Error occurs"});
                                    } else {
                                        bcrypt.hash(_pass, salt, null, (err, hash) => {
                                            var updatedData = {};
                                            if (pass != null && pass.length >= 8 && confirm != null && confirm.length >= 8) {
                                                updatedData.password = hash;
                                            }
                                            User.update(updatedData, {
                                                where: {id: userId}
                                            }).then((result_) => {
                                                if (result_) {
                                                    deferred.resolve({result: "ok"});
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        deferred.reject({error: "User is not exist"});
                    }
                })
            } else {
                deferred.reject({error: "Password is invalid"});
            }
        } else {
            deferred.reject({error: "Password is invalid"});
        }
        return deferred.promise;
    }

    User.updateUserData = function (body, userId) {
        var deferred = defer();
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var username = body.username;
        var last_name = body.last_name;
        var first_name = body.first_name;
        var email = re.test(body.email) ? body.email : null;
        if (email && username.length > 0 && username.length <= 10) {
            User.find({
                where: {
                    "email": email,
                    "id": {$ne: userId}
                }
            }).then(result => {
                if (result) {
                    deferred.reject({error: "Email exists"});
                } else {
                    User.find({
                        where: {
                            "id": userId
                        }
                    }).then(result=> {
                        if (result) {
                            var role = 1; // TODO
                            var country = body.country;
                            var birthDate = (body.day && body.month && body.year) ? body.year + "-" + body.month + "-" + body.day : null;
                            var phone = body.phone;
                            var image = body.image;
                            var company = body.company ? body.company : "";
                            var profession = body.profession ? body.profession : "";
                            var lastCheck = '00.00.00';  // TODO  need  session
                            var gender = body.gender;
                            var reg = /^\d+$/;
                            var _phone = phone != '' ? reg.test(phone) : '';
                            var today = new Date();
                            var reg = /^\d+$/;
                            var user = {};
                            user.id = userId;
                            user.role = role;
                            var updatedData = {
                                first_name: htmlspecialchars(first_name),
                                last_name: htmlspecialchars(last_name),
                                username: htmlspecialchars(username),
                                email: htmlspecialchars(email),
                                country: htmlspecialchars(country),
                                birthDate: birthDate,
                                phone: _phone,
                                lastCheck: lastCheck,
                                gender: gender,
                                company: company,
                                profession: profession
                            };
                            User.update(updatedData, {
                                where: {id: user.id}
                            }).then((result_) => {
                                if (result_) {
                                    deferred.resolve({result: "ok"});
                                }
                            })
                        } else {
                            deferred.reject({error: 'User is not found'});
                        }

                    })
                }
            })
        }
        return deferred.promise;
    }

    User.createDemoUser = function(ipAddress) {
        var deferred = defer();
        User.find({
            where: {
                "email": ipAddress
            }
        }).then(result => {
            if (!result) {
                var createdData = {
                    username: "demo_username",
                    email: ipAddress,
                    first_name: "demo_firstName",
                    last_name: "demo_lastName",
                    role: 2,//guest client
                    gender: 1
                };
                User.create(createdData).then(result => {
                    deferred.resolve({
                        result: {
                            id: result.id,
                            role: result.role,
                            username: result.username,
                            first_name: result.first_name,
                            last_name: result.last_name,
                            gender: result.gender
                        }
                    })
                })
            } else {
                deferred.resolve({
                    result: {
                        id: result.id,
                        role: result.role,
                        username: result.username,
                        first_name: result.first_name,
                        last_name: result.last_name,
                        gender: result.gender
                    }
                })
            }
        })
        return deferred.promise;
    }

    User.createUser = function(username, email, pass, confirm) {
        var deferred = defer();
        var isValidPass= true;
        if (email && username.length <= 10 ) {
            if (pass !== confirm) {
                isValidPass = false;
            }
            if (isValidPass) {
                User.find({
                    where: {
                        "email": email
                    }
                }).then(result => {
                    if (result) {
                        deferred.reject({error: 'Email exists'});
                    } else {
                        bcrypt.genSalt(10, (err, salt) => {
                            if (err) {
                                deferred.reject({error: 'Error occurs'});
                            } else {
                                bcrypt.hash(pass, salt, null, (err, hash) => {
                                    var createdData = {
                                        emailType: 0, //if no facebook and no google authentication only local authentication is supported here
                                        username: htmlspecialchars(username),
                                        email: htmlspecialchars(email),
                                        password: hash,
                                        first_name: htmlspecialchars(username),
                                        activation_code: utils.encrypt(Math.round(Math.random()*Number.MAX_SAFE_INTEGER).toString(36))
                                    };
                                    User.create(createdData).then(result => {
                                        events.emit('sendMail:verify', result);
                                        deferred.resolve({
                                            result: {
                                                id: result.id,
                                                role: result.role,
                                                username: result.username,
                                                first_name: result.first_name,
                                                last_name: result.last_name,
                                                email: result.email,
                                                gender: result.gender,
                                                country: result.country,
                                                birthDate: result.birthDate,
                                                company: result.company,
                                                profession: result.profession,
                                                phone: result.phone,
                                                image: result.image,
                                                registratedDate: result.registratedDate,
                                                lastCheck: result.lastCheck
                                            }
                                        });
                                    })
                                })
                            }
                        })
                    }
                })
            } else {
                deferred.reject({error: "Password is invalid"})
            }
        } else {
            deferred.reject({error: "Email / Username is invalid"})
        }

        return deferred.promise;
    }

    User.saveUser = function(body, emailType) {
        var deferred = defer();
        var user = {};
        var email = body.email;
        var gender = body.gender == "male" ? 0 : (body.gender == "female" ? 1 : body.gender);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var min = today.getMinutes();
        var sec = today.getSeconds();
        var tt = hh + ":" + min ;
        var registratedDate = yyyy + "-" + mm + "-" + dd + "-" + tt;
        user = {
            image: body.picture.data.url,
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            gender: gender,
            username: body.username,
            profession: body.profession,
            role: 1,
            emailType: emailType,
            country: '',
            birthDate: null,
            company: '',
            phone: '',
            registratedDate: registratedDate,
            lastCheck: null
        };
        User.find({
            where: {
                "email": email
            }
        }).then(result=> {
            if (result) {
                deferred.resolve({
                    id: result.id,
                    role: result.role,
                    username: result.username,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    email: result.email,
                    gender: result.gender,
                    country: result.country,
                    birthDate: result.birthDate,
                    company: result.company,
                    profession: result.profession,
                    phone: result.phone,
                    image: result.image,
                    registratedDate: result.registratedDate,
                    lastCheck: result.lastCheck
                })
            } else {
                User.create(user).then(result => {
                    deferred.resolve({
                        id: result.id,
                        role: result.role,
                        username: result.username,
                        first_name: result.first_name,
                        last_name: result.last_name,
                        email: result.email,
                        gender: result.gender,
                        country: result.country,
                        birthDate: result.birthDate,
                        company: result.company,
                        profession: result.profession,
                        phone: result.phone,
                        image: result.image,
                        registratedDate: result.registratedDate,
                        lastCheck: result.lastCheck
                    })
                });
            }
        });
        return deferred.promise;
    }

    User.getUserByUsernamePassword = function(email, password) {
        var deferred = defer();
        User.find({
            where: {
                "email": email
            }
        }).then((result)=> {
            if (result) {
                bcrypt.compare(password, result.password, (err, res) => {
                    if (!res) {
                        deferred.reject({error: "Password is incorrect"});
                    } else {
                        deferred.resolve({
                            id: result.id,
                            role: result.role,
                            username: result.username,
                            first_name: result.first_name,
                            last_name: result.last_name,
                            email: result.email,
                            gender: result.gender,
                            country: result.country,
                            birthDate: result.birthDate,
                            company: result.company,
                            profession: result.profession,
                            phone: result.phone,
                            image: result.image,
                            registratedDate: result.registratedDate,
                            lastCheck: result.lastCheck
                        })
                    }
                })
            } else {
                deferred.reject({error: "User is not found"});
            }
        })
        return deferred.promise;
    }

    User.updateSeoTries = function(userId, seoTries) {
        var deferred = defer();
        User.update({
            seoTries: seoTries,
            lastCheck: moment().unix()
        }, {
            where: {id: userId}
        }).then((result) => {
            if (result) {
                deferred.resolve({result: "ok"});
            }
        })
        return deferred.promise;
    }

    // Check User Status

    User.checkUserStatus = function(userId) {
        var deferred = defer();
        var id = userId;
        User.find({
            where: {
                "id": id
            }
        }).then(result => {
            var seoTries = result.seoTries;
            var diff = moment().diff(new Date(result.lastCheck*1000), 'hours');
            if (diff < 24) {
                if (seoTries > 0) {
                    deferred.resolve({result: seoTries});
                } else {
                    deferred.reject({error: "You have expired your limit"});
                }
            } else {
                var role = result.role == 2 ? 10 : result.role == 1 ? 20 : 0;
                User.updateSeoTries(userId, role).then(()=> {
                    deferred.resolve({result: role});
                });
            }
        });
        return deferred.promise;
    }

    User.updateImage = function(body, file, userId) {
        var deferred = defer();
        var fileName = null;
        if (file) {
            fileName = config.host + ":" + config.port +"/images/" + file.filename;
        }
        User.find({
            where: {
                "id": userId
            }
        }).then(result=> {
            if (result) {
                var updatedData = {};
                //user.image = htmlspecialchars(image); //TODO
                if (file) {
                    updatedData.image = fileName;
                }
                User.update(updatedData, {
                    where: {id: userId}
                }).then((result_) => {
                    if (result_) {
                        deferred.resolve({result: "ok"});
                    }
                })
            } else {
                deferred.reject({error: 'User is not found'});
            }
        });
        return deferred.promise;
    }
    return User;
};