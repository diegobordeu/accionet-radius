const express = require('express');
const routerController = require('../controllers/routerController');
const httpResponse = require('../../services/httpResponse');
const sessionController = require('../controllers/sessionController');
const isLoggedIn = require('../passport/passportService');

const router = express.Router(); // eslint-disable-line

/* GET home page. */
router.get('/session', isLoggedIn, (req, res) => {
  sessionController.all(req, res);
});

router.get('/session/find', isLoggedIn, (req, res) => {
  sessionController.find(req, res);
});

router.get('/help', isLoggedIn, (req, res) => {
  const help = httpResponse.success('Ok', 'help', {
    sessions: {
      '/find/?': 'place_id, client, id, bytes_in, bytes_out, session_time, startDate, endDate || {}',
      '/statistics/group-by/:(client || place_id)/?': ' startDate, endDate',
    },
    router_stats: {
      '/find/:place_id': 'null || {}',
      '/statistics/group-by/place_id': ' startDate, endDate, cpuDownLimit, cpuUpLimit',
    },
  });
  res.status(200).send(help);
});

router.get('/session/statistics/group-by/:group_by', isLoggedIn, (req, res) => {
  sessionController.sessionGroupBy(req, res);
});


router.get('/router_stats/find', isLoggedIn, (req, res) => {
  routerController.find(req, res);
});

router.get('/router_stats/statistics/by-place', isLoggedIn, (req, res) => {
  routerController.routerStatusGroupBy(req, res);
});

module.exports = router;
