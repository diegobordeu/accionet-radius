const Place = require('../models/table-gateway/place');
const path = require('path');
const httpResponse = require('codemaster').httpResponse;
const Table = require('chinchay').Table;
const HateoasGenerator = require('chinchay').Hateoas;


const viewPath = '../../client/views/place';


const newElement = (req, res) => {
  Place.new().then((result) => {
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

const show = (req, res) => {
  Place.findById(req.params.id).then((result) => {
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
  Place.find().then((results) => {
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
  Place.findById(req.params.id).then((result) => {
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
  HATEOAS.addLink('self', '/api/place/:id');
  HATEOAS.addLink('edit', '/api/place/:id/edit', 'POST');
  HATEOAS.addLink('delete', '/api/place/:id/delete', 'DELETE');
  HATEOAS.addLink('new', '/api/place/new', 'POST');
  HATEOAS.addLink('all', '/api/place/find');
  HATEOAS.addLink('count', '/api/place/count');
}

const create = (req, res) => {
  Place.save(req.body).then((results) => {
    const json = httpResponse.success('Elemento guardado exitosamente', 'data', results);
    json.data.links = HATEOAS.get(results);
    return res.status(200).send(json);
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const update = (req, res) => {
  Place.update(req.params.id, req.body).then(() => {
    // const json = httpResponse.success('Elemento actualizado exitosamente', 'data', results);
    // json.data.links = HATEOAS.get(results);
    // return res.status(200).send(json);
    return res.redirect('/front/network-device');
  }).catch((error) => {
    const json = httpResponse.error(error.message, error.fullMessage);
    return res.status(error.code).send(json);
  });
};

const del = (req, res) => {
  Place.delete(req.params.id).then((results) => {
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
  Place.find(query, columns, options).then((results) => {
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
  Place.findById(req.params.id, columns, options).then((results) => {
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
  Place.count(query, options).then((results) => {
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
  delete: del,
};
