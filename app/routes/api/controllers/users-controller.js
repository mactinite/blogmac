var mongoose = require('mongoose');
var User = mongoose.model('User');

var actions = {
    GetAll: function (req, res) {
        getAllUsers().then((users) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(users));
        }).catch(e => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(e));
        });
    },
    GetByEmail: function (req, res) {
        res.send('NOT IMPLEMENTED: User ' + req.params.email + ' details')
    },
}


function getUser(id) {
    return new Promise((resolve, reject) => {
        User.findById
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        User.find({})
            .select('-hash -salt')
            .populate("user", '-hash -salt')
            .exec((err, users) => {
                if (!users) {
                    reject({ error: "No users retrieved!" });
                }
                else {
                    resolve(users);
                }
            });
    });
}

module.exports = actions;