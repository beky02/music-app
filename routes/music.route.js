const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const multer  = require('multer')

const Music = require('../models/music');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + '-' + file.originalname);
    }
  });


var upload = multer({ storage: storage });
routes.post('/add',upload.single('music'),(req,res)=>{

    if (req.body.title && req.body.arthist) {
        console.log(req.body.comment);
        let newMusic = {
            "title": req.body.title,
            "arthist": req.body.arthist,
            "path": req.file.path,
            "timeStamp": Date.now()
        };
        console.log(newMusic);
        Music.create(newMusic, (err, doc) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            }
            else {
                res.status(201).json({
                    message: 'music created'
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

module.exports = routes;