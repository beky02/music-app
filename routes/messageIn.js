const express = require('express');
const routes = express.Router();
const RegUsers = require('../models/regusers');
const MessageOut3 = require('../models/messageout3');
const mongoose = require('mongoose');

routes.post('/ok', (req, res) => {
    if (req.body.mobile) {
        let newUser = {
            "mobile": req.body.mobile,
            "regDate": Date.now(),
            "regTime": Date.now()
        };
        console.log(newUser);
        RegUsers.create(newUser, (err, Regdoc) => {
            if (err) {
                if (err.message.includes('mobile')) {
                    res.status(400).json({
                        error: 'duplicate phone'
                    });
                }
                else {
                    res.status(500).json({
                        error: err
                    });
                }

            }
            else {
                let message3 = {
                    "messageTo": req.body.mobile,
                    "messageFrom": "6008",
                };
                MessageOut3.create(message3, (err, Mesdoc) => {
                    if (err) {
                        RegUsers.findByIdAndRemove(mongoose.Types.ObjectId(Regdoc._id), (err, content) => {
                            if (err) {
                                res.status(400).json({
                                    error: err
                                });
                            } else {
                                res.status(200).json({
                                    result: 'user is removed'
                                });
                            }
                        });
                    }
                    else {
                        res.status(201).json({
                            message: 'user is registered'
                        });
                    }
                });


            }
        });

    }
    else {
        res.status(400).json({
            message: 'one or more parameters missing'
        });
    }
});

routes.patch('/subscription', (req, res) => {
    if (req.body.mobile && req.body.subscription) {
        RegUsers.findOne({ mobile: req.body.mobile }, (err, user) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else if (user == null) {
                res.status(400).json({
                    result: 'user not found'
                });
            }
            else {

                var found = user.subcriptions.find(function (element) {
                    return element == req.body.subscription
                });
                // console.log(found);
                if (found != null) {
                    res.status(400).json({
                        message: 'You subscribed in this service before'
                    });
                } else {

                    RegUsers.findOneAndUpdate({ mobile: req.body.mobile }, {
                        $push: {
                            "subcriptions": req.body.subscription
                        }
                    }, {
                            new: true
                        }, (err, doc) => {
                            if (err) {
                                res.status(501).json({
                                    "error": err
                                });
                            } else {
                                res.status(200).json({
                                    result: 'You subscribed in this service. Tnks'
                                });
                            }
                        });

                }

            }
        });
    } else {
        res.status(400).json({
            message: 'one or more parameters missing'
        });
    }
});

routes.delete('/stop', (req, res) => {
    if (req.body.mobile) {
        RegUsers.findOneAndDelete({ mobile: req.body.mobile }, (err, user) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else if (user == null) {
                res.status(400).json({
                    result: 'user not found'
                });
            }
            else {
                res.status(200).json({
                    result: 'user is removed'
                });
            }
        });
    } else {
        res.status(400).json({
            message: 'one or more parameters missing'
        });
    }
});
module.exports = routes;
