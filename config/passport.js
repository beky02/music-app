const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const ClientModel = require('../models/user');
const AdminModel = require('../models/admin')

const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// used to serialize the user for the session
passport.serializeUser((user, done) => {
    console.log('serializable user', user);
    ClientModel.findById(mongoose.Types.ObjectId(user.id), (err, clientDoc) => {
        if (err) {
            console.log('error looking up client while serializing user');
        }
        else if (clientDoc != null) {
            console.log('client serialization ', clientDoc);
            return done(null, {
                id: user.id,
                type: 'client'
            });
        }
        else {
            AdminModel.findById(mongoose.Types.ObjectId(user.id), (err, adminDoc) => {
                if (err) {
                    console.log('error looking up admin while serializing user');
                }
                else if (adminDoc != null) {
                    return done(null, {
                        id: user.id,
                        type: 'admin'
                    });
                }
                else {

                    console.log('client doc', clientDoc);
                    console.log('admin doc', adminDoc);
                    console.log('serialization failed');
                }

            });
        }
    });
});

// used to deserialize the user
let Model = null;
let userType = null;
passport.deserializeUser((user, done) => {

    if (user.type === 'admin') {
        Model = AdminModel;
        userType = 'admin';
    }
    else if (user.type === 'client') {
        Model = ClientModel;
        userType = 'client';
    }

    Model.findOne({ _id: user.id }, '-salt -password', function (err, user) {

        let fullUserInfo = user;
        fullUserInfo.type = userType;
        done(err, fullUserInfo);

    });
});

/*
 Client authentication using Email and Password
*/

passport.use("client", new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    ClientModel.findOne({ email: email }, function (err, user) {

        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                error: 'no user found'
            });
        }
        bcrypt.compare(password, user.password)
            .then(passwordsMatch => {
                if (passwordsMatch) {
                    console.log('user found');
                    return done(null, user);
                }
                else {
                    return done(null, false, {
                        error: 'passwords do not match'
                    });
                }

            });
    });
}));
/*
 Admin authentication using Email and Password
*/

passport.use('admin', new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {
    AdminModel.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                error: 'admin not found'
            });
        }
        bcrypt.compare(password, user.password)
            .then(passwordsMatch => {
                if (passwordsMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {
                        error: 'password do not match'
                    });
                }
            });
    });
}));

/*
 pharmacist or doctor authentication using Email and Password
*/


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'kalu@198802';

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("this is jwt " + jwt_payload.id);
    ClientModel.findById(jwt_payload.id)
        .then(user => {
            if (user != null) {

                return done(null, user);
            } else {
                // done(new Error("User not found"), null);
                AdminModel.findById(jwt_payload.id)
                    .then(user => {
                        if (user != null) {
                            return done(null, user);
                        } else {
                            done(new Error("User not found"), null);
                        }

                    });
            }
        })
        .catch(
            err => {
                return (err);
            }
        );
}));