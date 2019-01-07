'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap


const subscriptionController = require('../controllers/subscriptionController');


router.get('/subscription/', isLoggedIn, (req, res, next) => {
  subscriptionController.index(req, res, next);
});

router.get('/subscription/new', isLoggedIn, (req, res, next) => {
  subscriptionController.new(req, res, next);
});

router.get('/subscription/:id', isLoggedIn, (req, res, next) => {
  subscriptionController.show(req, res, next);
});

router.get('/subscription/:id/edit', isLoggedIn, (req, res, next) => {
  subscriptionController.edit(req, res, next);
});


module.exports = router;
