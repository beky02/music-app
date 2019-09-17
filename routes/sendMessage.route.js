const express = require('express');
const routes = express.Router();
const Status = require('../models/sendStatus');
const Content = require('../models/content');
const MessageOut = require('../models/messageOut');
const RegUser = require('../models/regusers');

const mongoose = require('mongoose');
const moment = require('moment');
const now = moment();

function changeStatus_No() {
    // console.log(date.toDate());

    Status.findByIdAndUpdate(mongoose.Types.ObjectId("5d5ab6ad94352f3618ff8d5c"),
        {
            $set: {
                "status": "NO",
                "date": Date.now()
            }
        }, {
            new: true
        }
        , (err, doc) => {
            if (err) {
                // res.status(400).json({
                //     err
                // });
                console.log(err)
            } else {
                console.log("status updated to NO ")
            }
        });
}
function changeStatus_Yes() {
    // console.log(date.toDate());
    setTimeout(() => {
        // console.log(Status.schema.path('status').enumValues[1]);

        Status.findByIdAndUpdate(mongoose.Types.ObjectId("5d5ab6ad94352f3618ff8d5c"),
            {
                $set: {
                    "status": "YES",
                    "date": Date.now()
                }
            }, {
                new: true
            }
            , (err, doc) => {
                if (err) {
                    // res.status(400).json({
                    //     err
                    // });
                    console.log(err)
                } else {
                    console.log("status updated to YES ")
                }
            });
    }, 90000);
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

routes.post('/send/:id', (req, res) => {
    console.log(req.params.id);

    Content.findById(mongoose.Types.ObjectId(req.params.id), (err, doc) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else if (doc == null) {
            res.status(400).json({
                message: 'content not found'
            });
        } else {

            RegUser.find({}, (err, user) => {
                if (err) {
                    res.status(500).json(err)
                } else {
                    // console.log(user);
                    var found = null;
                    user.forEach(element => {
                        found = element.subcriptions.find((sub) => {
                            return sub == doc.keyword;
                        });
                        // console.log(found);
                        if (found != null) {
                            let message = {
                                "messageTo": element.mobile,
                                "messageFrom": "6096",
                                "messageText": doc.content
                            };
                            MessageOut.create(message, (err, Mesdoc) => {
                                if (err) {
                                    res.status(500).json(err);
                                }
                                else {
                                    console.log('content is inserted to messageOut table');
                                }
                            });
                        }
                        // else{
                        //     res.status(400).json({
                        //         message: "no user subcribed in this service"
                        //     });
                        // }

                    });
                    if (found == null) {
                        res.status(400).json({
                            message: "no user subcribed in this service"
                        });
                    } else {
                        changeStatus_No();
                        changeStatus_Yes();
                        res.status(200).json({
                            message: "content is inserted to messageOut table"
                        });
                    }

                }

            });

        }
    });

});



module.exports = routes;