'use strict';
const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap


const mailController = require('../controllers/mailController');


router.get('/mail/', isLoggedIn, (req, res, next) => {
  mailController.index(req, res, next);
});

router.get('/mail/new', isLoggedIn, (req, res, next) => {
  mailController.new(req, res, next);
});

router.get('/mail/:id', isLoggedIn, (req, res, next) => {
  mailController.show(req, res, next);
});

router.get('/mail/:id/edit', isLoggedIn, (req, res, next) => {
  mailController.edit(req, res, next);
});


module.exports = router;
