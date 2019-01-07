const express = require('express');
const sessionController = require('../controllers/sessionController');
const isLoggedIn = require('../passport/passportService');


const router = express.Router(); // eslint-disable-line

/* GET home page. */
router.get('/', isLoggedIn, (req, res) => {
  res.render('index', { title: 'server' });
});

router.post('/new', (req, res) => {
  sessionController.save(req, res);
});

module.exports = router;
