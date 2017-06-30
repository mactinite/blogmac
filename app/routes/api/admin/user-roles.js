var express = require('express');
var Promise = require('promise');
var util = require('util');
var authMW = require(appRoot + '/util/auth-middleware.js');

var mongoose = require("mongoose");
var User = mongoose.model("User");
var UserRole = mongoose.model("UserRole");

module.exports = function (passport, router) {

    router.get("/admin/user-roles", authMW.MatchPermissions(['admin']), (req, res) => {
        getAllUserRoles().then((roles) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(roles));
        }).catch(e => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(e));
        });
    });

    router.post('/admin/user-roles/delete', authMW.MatchPermissions(['admin']), (req, res) => {
        deleteUserRole(req.body.role_id).then((resp) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        })
            .catch(e => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(e));
            });
    });
    router.post('/admin/default-role', authMW.MatchPermissions(['admin']), (req, res) => {
        setDefaultRole(req.body.role_id).then((resp) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        })
            .catch(e => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(e));
            });
    });

    router.post('/admin/user-roles/new', authMW.MatchPermissions(['admin']), (req, res) => {
        var roleData = new UserRole();
        roleData.name = req.body.role_name;
        roleData.permissions = {
            write: req.body.can_write,
            edit: req.body.can_edit,
            delete: req.body.can_delete,
            admin: req.body.is_admin
        };
        addUserRole(roleData).then((resp) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        })
            .catch(e => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(e));
            });
    });
}

function getAllUserRoles() {
    return new Promise((resolve, reject) => {
        UserRole.find({}, (err, roles) => {
            var roleMap = {};
            roles.forEach((role) => {
                roleMap[role.name] = role;
            });
            if (!err) {
                resolve(roles);
            }
            else {

                reject(err);
            }
        });
    });
}

function addUserRole(role) {
    return new Promise((resolve, reject) => {
        role.save(err => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ status: 'SUCCESS' });
            }
        });
    });
}

function deleteUserRole(id) {
    return new Promise((resolve, reject) => {
        UserRole.deleteOne({ '_id': id }, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ status: 'SUCCESS' });
            }
        });
    });
}

function setDefaultRole(id) {
    return new Promise((resolve, reject) => {
        UserRole.update({ default: true }, { default: false }, (err) => {
            if (err) {
                reject({ error: "Couldn't change default role" });
            }
            UserRole.update({ _id: id }, { default: true }, (err) => {
                if (err) {
                    reject({ error: "Couldn't change default role" });
                }
                else {
                    resolve({ status: "SUCCESS" });
                }
            });
        })

    });
}