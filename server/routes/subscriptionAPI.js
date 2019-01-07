'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap


const subscriptionController = require('../controllers/subscriptionController');


// CREATE

router.post('/api/subscription/new', isLoggedIn, (req, res, next) => {
  subscriptionController.create(req, res, next);
});

// READ

router.get('/api/subscription/find', isLoggedIn, (req, res, next) => {
  subscriptionController.find(req, res, next);
});

router.get('/api/subscription/count', isLoggedIn, (req, res, next) => {
  subscriptionController.count(req, res, next);
});

router.get('/api/subscription/:id', isLoggedIn, (req, res, next) => {
  subscriptionController.findById(req, res, next);
});

// UPDATE

router.put('/api/subscription/:id/edit', isLoggedIn, (req, res, next) => {
  subscriptionController.update(req, res, next);
});

router.post('/api/subscription/:id/edit', isLoggedIn, (req, res, next) => {
  subscriptionController.update(req, res, next);
});

router.patch('/api/subscription/:id/edit', isLoggedIn, (req, res, next) => {
  subscriptionController.update(req, res, next);
});

// DELETE

router.delete('/api/subscription/:id', isLoggedIn, (req, res, next) => {
  subscriptionController.delete(req, res, next);
});


module.exports = router;
