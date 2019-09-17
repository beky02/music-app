const express = require('express');
const routes = express.Router();


routes.use('/music',require('./music.route'));
routes.use('/content',require('./content.route'));
routes.use('/messageIn',require('./messageIn'));
routes.use('/messageSend',require('./sendMessage.route'));
routes.use('/admin',require('./admin.route'));

module.exports = routes;