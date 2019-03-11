'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');


const router = express.Router(); // eslint-disable-line new-cap


const userController = require('../controllers/userController');


router.get('/api/user/find', isLoggedIn, (req, res, next) => {
  userController.find(req, res, next);
});

router.get('/api/user/count', isLoggedIn, (req, res, next) => {
  userController.count(req, res, next);
});

router.get('/api/user/:id', isLoggedIn, (req, res, next) => {
  userController.findById(req, res, next);
});


module.exports = router;
