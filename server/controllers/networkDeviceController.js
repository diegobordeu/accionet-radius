const NetworkDevice = require('../models/table-gateway/networkDevice');
const path = require('path');
const httpResponse = require('codemaster').httpResponse;
const Table = require('chinchay').Table;
const HateoasGenerator = require('chinchay').Hateoas;


const viewPath = '../../client/views/networkDevice';


const newElement = (req, res) => {
  NetworkDevice.new().then((result) => {
    delete result.id;
    delete result.created_at;
    delete result.updated_at;
    res.render(path.join(viewPath, 'create.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'create.ejs'), {
      error,
      result: {},
    });
  });
};

const groupByPlace = (req, res) => {
  NetworkDevice.groupBy().then((result) => {
    const json = httpResponse.success('Ok', 'group_by network_device', result);
    return res.status(200).send(json);
  }).catch((err) => {
    const json = httpResponse.error(err);
    return res.status(400).send(json);
  });
};

const show = (req, res) => {
  NetworkDevice.findById(req.params.id).then((result) => {
    res.render(path.join(viewPath, 'show.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'show.ejs'), {
      error,
      result: {},
    });
  });
};

const index = (req, res) => {
  NetworkDevice.find().then((results) => {
    res.render(path.join(viewPath, 'index.ejs'), {
      results,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'index.ejs'), {
      error,
      results: [],
    });
  });
};

const edit = (req, res) => {
  NetworkDevice.findById(req.params.id).then((result) => {
    res.render(path.join(viewPath, 'edit.ejs'), {
      result,
    });
  }).catch((error) => {
    res.render(path.join(viewPath, 'edit.ejs'), {
      error,
      result: {},
    });
  });
};

// //////////// API ///////////////

const HATEOAS = new HateoasGenerator();
initializeHATEOAS();

function initializeHATEOAS() {
  HATEOAS.addLink('self', '/api/network_device/:id');
  HATEOAS.addLink('edit', '/api/network_device/:id/edit', 'POST');
  HATEOAS.addLink('delete', '/api/network_device/:id/delete', 'DELETE');
  HATEOAS.addLink('new', '/api/network_device/new', 'POST');
  HATEOAS.addLink('all', '/api/network_device/find');
  HATEOAS.addLink('count', '/api/network_device/count');
}

const create = (req, res) => {
  NetworkDevice.save(req.body).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const update = (req, res) => {
  NetworkDevice.update(req.params.id, req.body).then((results) => {
    const json = httpResponse.success('Elemento actualizado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    // return res.status(200).send(json);
    return res.redirect('/front/network-device');
  }).catch((error) => {
    // const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(500).send(error);
  });
};

const del = (req, res) => {
  NetworkDevice.delete(req.params.id).then((results) => {
    const json = httpResponse.success('Elemento eliminado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};


const find = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  const query = Table.extractQuery(req.query);
  NetworkDevice.find(query, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    for (let i = 0; i < json.data.length; i++) {
      json.data[i].links = HATEOAS.get(json.data[i]);
    }
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const findById = (req, res) => {
  const options = Table.extractOptions(req.query);
  const columns = Table.extractColumns(req.query);
  NetworkDevice.findById(req.params.id, columns, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const count = (req, res) => {
  const options = Table.extractOptions(req.query);
  const query = Table.extractQuery(req.query);
  NetworkDevice.count(query, options).then((results) => {
    const json = httpResponse.success('Busqueda encontrada exitosamente', 'data', results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};


module.exports = {
  new: newElement,
  show,
  index,
  edit,
  create,
  find,
  findById,
  count,
  update,
  groupByPlace,
  delete: del,
};
