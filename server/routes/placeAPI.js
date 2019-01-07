'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


const placeController = require('../controllers/placeController');


// CREATE

router.post('/api/place/new', (req, res, next) => {
  placeController.create(req, res, next);
});

// READ

router.get('/api/place/find', (req, res, next) => {
  placeController.find(req, res, next);
});

router.get('/api/place/count', (req, res, next) => {
  placeController.count(req, res, next);
});

router.get('/api/place/:id', (req, res, next) => {
  placeController.findById(req, res, next);
});

// UPDATE

router.put('/api/place/:id/edit', (req, res, next) => {
  placeController.update(req, res, next);
});

router.post('/api/place/:id/edit', (req, res, next) => {
  placeController.update(req, res, next);
});

router.patch('/api/place/:id/edit', (req, res, next) => {
  placeController.update(req, res, next);
});

// DELETE

router.delete('/api/place/:id', (req, res, next) => {
  placeController.delete(req, res, next);
});


module.exports = router;
