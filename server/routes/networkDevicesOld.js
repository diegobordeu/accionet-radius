const express = require('express');
const networkDevicesController = require('../controllers/networkDevicesController');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
/* GET home page. */


router.post('/create/:place_id/:ip/:frendly_name/', isLoggedIn, (req, res) => {
  networkDevicesController.create(req, res);
});

router.delete('/delete/:place_id/:ip/', isLoggedIn, (req, res) => {
  networkDevicesController.delete(req, res);
});

router.get('/find', isLoggedIn, (req, res) => {
  networkDevicesController.read(req, res);
});

router.post('/update/:place_id/:ip', isLoggedIn, (req, res) => {
  networkDevicesController.update(req, res);
});

router.post('/set-up-status/:place_id/:ip/:up', (req, res) => {
  networkDevicesController.setUpStatus(req, res);
});

router.post('/set-up-status/polling/', (req, res) => {
  networkDevicesController.pollingUpdate(req, res);
});

module.exports = router;
