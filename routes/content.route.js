
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const routes = express.Router();

const Content = require('../models/content.js');
// content add or save
routes.post('/add', (req, res) => {
    if (req.body.content && req.body.keyword) {

        let newContent = {
            "keyword": req.body.keyword,
            "content": req.body.content,
            "savedTime": Date.now(),
            "savedDate": Date.now()
        };
        console.log(newContent);
        Content.create(newContent, (err, doc) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }
            else {
                res.status(201).json({
                    message: 'content created'
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

// content edit

routes.patch('/edit/:Id', (req, res) => {
     if (req.body.content && req.body.keyword) {

        let content = {
            "keyword": req.body.keyword,
            "content": req.body.content,
        };

        Content.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.Id), {
            $set: content
        }, {
                new: true
            }, (err, doc) => {
                if (err) {
                    res.status(501).json({
                        error: err
                    });
                } else if (doc == null) {
                    res.status(400).json({
                        message: 'content not found'
                    });
                }
                else {
                    res.status(201).json(doc);
                }
            }
        );

    } else {
        res.status(400).json({
            message: 'one or more parameters missing'
        });
    }
});

// content delete

routes.delete('/delete/:Id', (req, res) => {

    Content.findByIdAndRemove(mongoose.Types.ObjectId(req.params.Id), (err, content) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else if (content == null) {
            res.status(400).json({
                message: 'content not found to delete'
            });
        } else {
            res.status(200).json({
                result: content
            });
        }
    });

});
// content view

routes.get('/all', (req, res) => {

    Content.find({})
        .then(function (contents) {

            res.status(200).json({
                content: contents

            });
        }, function (err) {
            res.status(501).json({
                "error": err
            });
        });

});

module.exports = routes;