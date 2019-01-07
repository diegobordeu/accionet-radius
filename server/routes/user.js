'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');


const router = express.Router(); // eslint-disable-line new-cap


const userController = require('../controllers/userController');


router.get('/user/', isLoggedIn, (req, res, next) => {
  userController.index(req, res, next);
});

router.get('/user/new', isLoggedIn, (req, res, next) => {
  userController.new(req, res, next);
});

router.get('/user/:id', isLoggedIn, (req, res, next) => {
  userController.show(req, res, next);
});

router.get('/user/:id/edit', isLoggedIn, (req, res, next) => {
  userController.edit(req, res, next);
});

router.post('/user/new', isLoggedIn, (req, res, next) => {
  userController.create(req, res, next);
});

router.put('/user/:id/edit', isLoggedIn, (req, res, next) => {
  userController.update(req, res, next);
});

router.post('/user/:id/edit', isLoggedIn, (req, res, next) => {
  userController.update(req, res, next);
});

router.patch('/user/:id/edit', isLoggedIn, (req, res, next) => {
  userController.update(req, res, next);
});

router.delete('/user/:id', isLoggedIn, (req, res, next) => {
  userController.delete(req, res, next);
});


module.exports = router;
