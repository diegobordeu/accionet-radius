'use strict';

const express = require('express');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line new-cap

const networkDeviceController = require('../controllers/networkDeviceController');


// CREATE

router.post('/api/network_device/new', isLoggedIn, (req, res, next) => {
  networkDeviceController.create(req, res, next);
});

// READ

router.get('/api/network_device/find', isLoggedIn, (req, res, next) => {
  networkDeviceController.find(req, res, next);
});

router.get('/api/network_device/count', isLoggedIn, (req, res, next) => {
  networkDeviceController.count(req, res, next);
});

router.get('/api/network_device/group-by/', isLoggedIn, (req, res) => {
  networkDeviceController.groupByPlace(req, res);
});

router.get('/api/network_device/:id', isLoggedIn, (req, res, next) => {
  networkDeviceController.findById(req, res, next);
});


// UPDATE

router.put('/api/network_device/:id/edit', isLoggedIn, (req, res, next) => {
  networkDeviceController.update(req, res, next);
});

router.post('/api/network_device/:id/edit', isLoggedIn, (req, res, next) => {
  networkDeviceController.update(req, res, next);
});

router.patch('/api/network_device/:id/edit', isLoggedIn, (req, res, next) => {
  networkDeviceController.update(req, res, next);
});

// DELETE

router.delete('/api/network_device/:id', isLoggedIn, (req, res, next) => {
  networkDeviceController.delete(req, res, next);
});


module.exports = router;
