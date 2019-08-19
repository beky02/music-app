const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);

/**
 * Passport configuration.
 */
const passportConfig = require('./config/passport');


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(`mongodb://127.0.0.1:27017/Message`)
  .then(() => {
    console.log('Connected Successfully!');
  })
  .catch((err) => {
    console.log(err);
    console.log('Connection failed');
  });
  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(express.static("public"));
app.use(session({resave: false,
  saveUninitialized: false,
  secret: "kalu"
}));
app.use(cors({
  credentials: true,
  origin: '*'
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads',express.static('uploads'));
const routes = require('./routes/routes');
app.use('/',routes);

app.listen(8000,function(){
    console.log("server is connected")
})