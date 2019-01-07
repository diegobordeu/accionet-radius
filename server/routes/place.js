'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


const placeController = require('../controllers/placeController');


router.get('/place/', (req, res, next) => {
  placeController.index(req, res, next);
});

router.get('/place/new', (req, res, next) => {
  placeController.new(req, res, next);
});

router.get('/place/:id', (req, res, next) => {
  placeController.show(req, res, next);
});

router.get('/place/:id/edit', (req, res, next) => {
  placeController.edit(req, res, next);
});


module.exports = router;
