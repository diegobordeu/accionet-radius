'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap


const networkDeviceController = require('../controllers/networkDeviceController');


router.get('/network_device/', isLoggedIn, (req, res, next) => {
  networkDeviceController.index(req, res, next);
});

router.get('/network_device/new', isLoggedIn, (req, res, next) => {
  networkDeviceController.new(req, res, next);
});

router.get('/network_device/:id', isLoggedIn, (req, res, next) => {
  networkDeviceController.show(req, res, next);
});

router.get('/network_device/:id/edit', isLoggedIn, (req, res, next) => {
  networkDeviceController.edit(req, res, next);
});


module.exports = router;
