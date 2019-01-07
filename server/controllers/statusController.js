const monitor = require('../models/monitor');
const httpResponse = require('../../services/httpResponse');

exports.getServerStatus = (req, res) => {
  const status = monitor.getStatus();
  const json = httpResponse.success('Ok', 'status', status);
  return res.status(200).send(json);
};
