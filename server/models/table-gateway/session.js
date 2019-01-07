const Table = require('../../../services/models/table'); // eslint-disable-line no-unused-vars
// const knex = require('../../../db/knex');

class Session extends Table {

  constructor() {
    const table_name = 'session';
    super(table_name);
  }
  groupBy(groupBy, options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      let otherVar = 'client';
      if (groupBy === 'client') { otherVar = 'place_id'; }
      const query = this.table().select(groupBy).sum('bytes_in as SUM(Bytes-In)')
      .sum('bytes_out as SUM(Bytes-Out)')
      .sum('session_time as SUM(Session_time)')
      .sum('bytes_out as SUM(Bytes-Out)')
      .avg('bytes_in as AVG(Bytes-In)')
      .avg('bytes_out as AVG(Bytes-Out)')
      .avg('session_time as AVG(Session_time)')
      .avg('bytes_out as AVG(Bytes-Out)')
      .max('bytes_in as MAX(Bytes-In)')
      .max('bytes_out as MAX(Bytes-Out)')
      .max('session_time as MAX(Session_time)')
      .max('bytes_out as MAX(Bytes-Out)')
      .min('bytes_in as MIN(Bytes-In)')
      .min('bytes_out as MIN(Bytes-Out)')
      .min('session_time as MIN(Session_time)')
      .min('bytes_out as MIN(Bytes-Out)')
      .countDistinct(`${otherVar} as COUNTDIS(${otherVar})`)
      .count(`${groupBy} as COUNT(${groupBy})`)
      .groupBy(groupBy);
      if (options.client) {
        query.andWhere('client', '=', options.client);
      }
      this.addTimeInterval(query, options.startDate, options.endDate);
      query.then((results) => {
        if (groupBy === 'place_id') {
          resolve(parseToJsonPlace(results));
        }
        if (groupBy === 'client') {
          resolve(parseToJsonClient(results));
        }
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}

function parseToJsonPlace(json) {
  const response = {};
  json.forEach((result) => {
    response[result.place_id] = {
      bytes_in: {
        sum: result['SUM(Bytes-In)'],
        avg: result['AVG(Bytes-In)'],
        max: result['MAX(Bytes-In)'],
        min: result['MIN(Bytes-In)'],
      },
      bytes_out: {
        sum: result['SUM(Bytes-Out)'],
        avg: result['AVG(Bytes-Out)'],
        max: result['MAX(Bytes-Out)'],
        min: result['MIN(Bytes-Out)'],
      },
      session_time: {
        sum: result['SUM(Session_time)'],
        avg: result['AVG(Session_time)'],
        max: result['MAX(Session_time)'],
        min: result['MIN(Session_time)'],
      },
      sessions: result['COUNT(place_id)'],
      different_clients: result['COUNTDIS(client)'],
    };
  });
  return response;
}

function parseToJsonClient(json) {
  const response = {};
  json.forEach((result) => {
    response[result.client] = {
      bytes_in: {
        sum: result['SUM(Bytes-In)'],
        avg: result['AVG(Bytes-In)'],
        max: result['MAX(Bytes-In)'],
        min: result['MIN(Bytes-In)'],
      },
      bytes_out: {
        sum: result['SUM(Bytes-Out)'],
        avg: result['AVG(Bytes-Out)'],
        max: result['MAX(Bytes-Out)'],
        min: result['MIN(Bytes-Out)'],
      },
      session_time: {
        sum: result['SUM(Session_time)'],
        avg: result['AVG(Session_time)'],
        max: result['MAX(Session_time)'],
        min: result['MIN(Session_time)'],
      },
      sessions: result['COUNT(client)'],
      different_places: result['COUNTDIS(place_id)'],
    };
  });
  return response;
}

const instance = new Session();

module.exports = instance;
