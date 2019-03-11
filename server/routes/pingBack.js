'use strict';

const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap


// const placeController = require('../controllers/placeController');


router.get('/api/pingBack/', (req, res) => {
  // console.log(req, 'reqest......................................');
  console.log(req.params, 'params.................................');
  console.log(req.body, 'body........................................');
  res.status(200).send('ok test');
});


module.exports = router;
