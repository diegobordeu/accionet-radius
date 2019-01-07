const Session = require('../models/table-gateway/session');
const httpResponse = require('../../services/httpResponse');

exports.save = (req, res) => {
  const query = JSON.parse(req.body.payload);
  const time = new Date(query.sessionTime * 1000);
  const stringTime = `${time.getUTCHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  saveNewSession(query.macAddress, query.bytesOut, query.bytesIn, stringTime, query.placeId).then((result) => {
    const json = httpResponse.success('Ok', 'session', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};


const saveNewSession = async (macAddress, bytesIn, bytesOut, sessionTime, place_id) => {
  const struct = await Session.new();
  struct.place_id = place_id;
  struct.session_time = sessionTime;
  struct.client = `T-${macAddress.trim()}`;
  struct.bytes_in = bytesIn;
  struct.bytes_out = bytesOut;
  return await Session.save(struct);
};

exports.all = (req, res) => {
  Session.find({}).then((result) => {
    const json = httpResponse.success('Ok', 'get-session', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.find = (req, res) => {
  const options = {
    startDate: req.query.startDate || null,
    endDate: req.query.endDate || null,
  };
  delete req.query.startDate;
  delete req.query.endDate;
  Session.find(req.query, undefined, options).then((result) => {
    const json = httpResponse.success('Ok', 'get-session', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.sessionGroupBy = (req, res) => {
  const options = {
    startDate: req.query.startDate || null,
    endDate: req.query.endDate || null,
    client: req.query.client || null,
  };
  Session.groupBy(req.params.group_by, options).then((results) => {
    const json = httpResponse.success('Ok', 'session-order-by', results);
    return res.status(200).send(json);
  })
  .catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};
