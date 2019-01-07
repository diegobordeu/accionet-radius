const NetworkDevices = require('../models/table-gateway/network_devices');
const httpResponse = require('../../services/httpResponse');
const AlertManager = require('../models/alertManager');


exports.create = (req, res) => {
  NetworkDevices.new().then((struct) => {
    struct.place_id = req.params.place_id;
    struct.ip = req.params.ip;
    struct.friendly_name = req.params.frendly_name;
    struct.is_up = false;
    if (req.query.method) {
      if (req.query.method === 'polling') {
        struct.method = 'polling';
      } else {
        const json = httpResponse.error('BAD REQUEST');
        return res.status(400).send(json);
      }
    }
    NetworkDevices.save(struct).then((result) => {
      const json = httpResponse.success('Ok', 'create network_device', result);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  });
};

exports.pollingUpdate = (req, res) => {
  if (req.body.place_id && req.body.ip && req.body.is_up) {
    const query = {
      place_id: req.body.place_id,
      ip: req.body.ip,
    };
    NetworkDevices.find(query).then((devices) => {
      if (!devices[0].is_up && req.body.is_up) {
        AlertManager.notifyPollingDeviceUp(devices[0]);
      }
      NetworkDevices.update(devices[0].id, {
        is_up: req.body.is_up,
        status_update_at: new Date(),
      }).then((result) => {
        const json = httpResponse.success('Ok', 'data', result);
        return res.status(200).send(json);
      }).catch((err) => {
        const json = httpResponse.error(err);
        return res.status(400).send(json);
      });
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  } else {
    const json = httpResponse.error('place_id and ip must be define');
    return res.status(400).send(json);
  }
};

exports.delete = (req, res) => {
  if (!req.params.place_id && !req.params.ip) {
    const json = httpResponse.error('place_id and ip must be define');
    return res.status(400).send(json);
  }
  NetworkDevices.deleteWhere({
    place_id: req.params.place_id,
    ip: req.params.ip,
  }).then((results) => {
    const json = httpResponse.success('Ok', 'delet network_device', results);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.read = (req, res) => {
  NetworkDevices.find(req.query).then((results) => {
    const json = httpResponse.success('Ok', 'read network_device', results);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.groupByPlace = (req, res) => {
  NetworkDevices.groupBy().then((result) => {
    const json = httpResponse.success('Ok', 'group_by network_device', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.update = (req, res) => {
  const findQuery = {
    place_id: req.params.place_id,
    ip: req.params.ip,
  };
  NetworkDevices.find(findQuery).then((results) => {
    NetworkDevices.update(results[0].id, req.query).then((result) => {
      const json = httpResponse.success('Ok', 'update network_device', result);
      return res.status(200).send(json);
    }).catch((err) => {
      const json = httpResponse.error(err);
      return res.status(400).send(json);
    });
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

exports.setUpStatus = (req, res) => {
  const findQuery = {
    place_id: req.params.place_id,
    ip: req.params.ip,
  };
  const state = req.params.up === 't';
  AlertManager.alert(findQuery, state).then((a) => {
    const json = httpResponse.success('Ok', 'update network_device', a);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};
