const {
    promisify
} = require('util');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
const nodemailer = require('nodemailer');
const passport = require('passport');
const randomBytesAsync = promisify(crypto.randomBytes);
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const routes = express.Router();

const admin = require('../models/admin');
const user = require('../models/user');

/*
 * To signup a admin
 * Only a logged in admin can register another admin
 */
routes.post('/signup', (req, res) => {
    if (req.body.firstname && req.body.lastname && req.body.sex && req.body.dateOfBirth &&
        req.body.phone && req.body.password && req.body.email) {

        const {
            password
        } = req.body;


        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password must be at least 6 characters long').len(6);
        req.assert('phone', 'Password must be  10 characters long').len(10);
        req.sanitize('email').normalizeEmail({
            gmail_remove_dots: false
        });

        const errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        }

        const hashCost = 10;

        bcrypt.hash(password, hashCost)
            .then(passwordHash => {
                // req.body.dateOfBirth should be MM/DD/YYYY format
                let dateOfBirth = new Date(req.body.dateOfBirth);
                let postData = {
                    'firstname': req.body.firstname,
                    'lastname': req.body.lastname,
                    'sex': req.body.sex,
                    'dateOfBirth': dateOfBirth,
                    'phone': req.body.phone,
                    'password': passwordHash,
                    'email': req.body.email,
                    'addedBy': req.user._id
                };

                // Logged in user has to be an admin to be able to add another admin
                admin.findById(mongoose.Types.ObjectId(req.user._id), (err, doc) => {
                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                    } else {
                        if (doc === null || doc.length <= 0) {
                            res.status(401).json({
                                error: 'unauthorized access'
                            });
                        } else {
                            admin.create(postData, (err, doc) => {
                                if (err) {
                                    console.log('Error while creating admin', err.message);
                                    if (err.message.includes('phone') && err.message.includes('email')) {
                                        res.status(400).json({
                                            error: 'duplicate email and phone'
                                        });
                                    } else if (err.message.includes('phone')) {
                                        res.status(400).json({
                                            error: 'duplicate phone'
                                        });
                                    } else if (err.message.includes('email')) {
                                        res.status(400).json({
                                            error: 'duplicate email'
                                        });
                                    } else {
                                        res.status(400).send({
                                            error: err.message,
                                        });
                                    }

                                } else {
                                    console.log('admin doc created ', doc);
                                    res.status(201).json({
                                        message: 'admin created successfully'
                                    });
                                }
                            });


                        }
                    }
                });

            })
            .catch(() => {
                res.status(400).send({
                    error: 'data required: email, firstname, lastname, sex, date of birth, phone and password',
                });
            });
    } else {
        res.status(400).json({
            error: 'one or more parameters missing'
        });
    }
});

// admin add user 

routes.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    // console.log(req.body);
    if (req.body.firstname && req.body.lastname && req.body.sex && req.body.dateOfBirth &&
        req.body.phone && req.body.password && req.body.email) {

        const {
            password
        } = req.body;


        req.assert('email', 'Email is not valid').isEmail();
        req.assert('password', 'Password must be at least 6 characters long').len(6);
        req.assert('phone', 'Password must be  10 characters long').len(10);
        req.sanitize('email').normalizeEmail({
            gmail_remove_dots: false
        });

        const errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        }

        const hashCost = 10;


        bcrypt.hash(password, hashCost)
            .then(passwordHash => {
                // req.body.dateOfBirth should be MM/DD/YYYY format

                // Logged in user has to be an admin to be able to add another admin
                console.log("req user id " + req.user);
                admin.findById(mongoose.Types.ObjectId(req.user._id), (err, doc) => {

                    if (err) {
                        res.status(400).json({
                            error: err
                        });
                    } else {
                        if (doc === null || doc.length <= 0) {
                            res.status(401).json({
                                error: 'unauthorized access'
                            });
                        } else {
                            let dateOfBirth = new Date(req.body.dateOfBirth);
                            let postData = {
                                'firstname': req.body.firstname,
                                'lastname': req.body.lastname,
                                'sex': req.body.sex,
                                'dateOfBirth': dateOfBirth,
                                'phone': req.body.phone,
                                'password': passwordHash,
                                'email': req.body.email,
                                'addedBy': req.user._id
                            };

                            user.create(postData, (err, doc) => {
                                if (err) {
                                    console.log('Error while creating user', err.message);
                                    if (err.message.includes('phone') && err.message.includes('email')) {
                                        res.status(400).json({
                                            error: 'duplicate email and phone'
                                        });
                                    } else if (err.message.includes('phone')) {
                                        res.status(400).json({
                                            error: 'duplicate phone'
                                        });
                                    } else if (err.message.includes('email')) {
                                        res.status(400).json({
                                            error: 'duplicate email'
                                        });
                                    } else {
                                        res.status(400).send({
                                            error: err.message,
                                        });
                                    }

                                } else {
                                    console.log('pharmacist or doctor created ', doc);
                                    res.status(201).json({
                                        message: 'user created successfully',
                                        user: doc
                                    });
                                }
                            });


                        }
                    }
                });

            })
            .catch(() => {
                res.status(400).send({
                    error: 'data required: email, firstname, lastname, sex, date of birth, phone and password',
                });
            });
    } else {
        res.status(400).json({
            error: 'one or more parameters missing'
        });
    }
});