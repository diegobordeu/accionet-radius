const express = require('express');

const router = express.Router(); // eslint-disable-line

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});


module.exports = router;
