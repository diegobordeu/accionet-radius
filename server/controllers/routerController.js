
const httpResponse = require('../../services/httpResponse');
const RouterStatus = require('../models/table-gateway/router_stats');


exports.find = (req, res) => {
  const options = {
    startDate: req.query.startDate || null,
    endDate: req.query.endDate || null,
  };
  delete req.query.startDate;
  delete req.query.endDate;
  RouterStatus.find(req.query, undefined, options).then((result) => {
    const json = httpResponse.success('Ok', 'data', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};


exports.routerStatusGroupBy = (req, res) => {
  const options = {
    startDate: req.query.startDate || null,
    endDate: req.query.endDate || null,
    upLimit: req.query.cpuUpLimit || null,
    downLimit: req.query.cpuDownLimit || null,
  };

  RouterStatus.groupBy(options).then((results) => {
    const json = httpResponse.success('Ok', 'router-order-by', results);
    return res.status(200).send(json);
  })
  .catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};
