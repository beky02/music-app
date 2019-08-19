const express = require('express');
const routes = express.Router();
const Status = require('../models/sendStatus');

const mongoose = require('mongoose');
const moment = require('moment');
const Date = moment();

function changeStatus(date) {
    setTimeout(() => {
        // console.log(Status.schema.path('status').enumValues[1]);
        Status.findByIdAndUpdate(mongoose.Types.ObjectId("5d5ab6ad94352f3618ff8d5c"),
            {
                $push: {
                    "status": "YES",
                    "date": date
                }
            }, {
                new: true
            }
            , (err, doc) => {
                if (err) {
                    res.status(400).json({
                        err
                    });
                } else {
                    console.log("status updated to YES ")
                }
            });
    },3000 );
}


routes.get('/status', (req, res) => {
    Status.findById(mongoose.Types.ObjectId("5d5ab6ad94352f3618ff8d5c"), (err, doc) => {
        if (err) {
            res.status(400).json({
                err
            });
        } else {
            res.status(200).json(doc);
        }
    });
});

routes.post('/send',(req,res)=>{
    
});



module.exports = routes;