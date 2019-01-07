'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap


const mailController = require('../controllers/mailController');


// CREATE

router.post('/api/mail/new', isLoggedIn, (req, res, next) => {
  mailController.create(req, res, next);
});

// READ

router.get('/api/mail/find', isLoggedIn, (req, res, next) => {
  mailController.find(req, res, next);
});

router.get('/api/mail/count', isLoggedIn, (req, res, next) => {
  mailController.count(req, res, next);
});

router.get('/api/mail/:id', isLoggedIn, (req, res, next) => {
  mailController.findById(req, res, next);
});

// UPDATE

router.put('/api/mail/:id/edit', isLoggedIn, (req, res, next) => {
  mailController.update(req, res, next);
});

router.post('/api/mail/:id/edit', isLoggedIn, (req, res, next) => {
  mailController.update(req, res, next);
});

router.patch('/api/mail/:id/edit', isLoggedIn, (req, res, next) => {
  mailController.update(req, res, next);
});

// DELETE

router.delete('/api/mail/:id', isLoggedIn, (req, res, next) => {
  mailController.delete(req, res, next);
});


module.exports = router;
