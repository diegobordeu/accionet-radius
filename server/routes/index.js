const express = require('express');

const router = express.Router(); // eslint-disable-line
const isLoggedIn = require('../passport/passportService');

/* GET home page. */
router.get('/', isLoggedIn, (req, res) => {
  res.render('index', { title: 'Express' });
});


module.exports = router;
