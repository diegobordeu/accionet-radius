const express = require('express');
const statusController = require('../controllers/statusController');


const router = express.Router(); // eslint-disable-line

/* GET home page. */
router.get('/', (req, res) => {
  statusController.getServerStatus(req, res);
});

module.exports = router;
