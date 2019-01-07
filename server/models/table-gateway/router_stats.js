const Table = require('../../../services/models/table'); // eslint-disable-line no-unused-vars


class Router_stats extends Table {

  constructor() {
    const table_name = 'router_stats';
    super(table_name);
  }
  groupBy(options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      const query = this.table().select('place_id')
      .avg('cpu_usage as AVG(Cpu_usage)')
      .avg('free_memory as AVG(Free_memory)')
      .max('cpu_usage as MAX(Cpu_usage)')
      .max('free_memory as MAX(Free_memory)')
      .min('cpu_usage as MIN(Cpu_usage)')
      .min('free_memory as MIN(Free_memory)')
      .countDistinct('id as COUNT(id)')
      .groupBy('place_id');
      this.addCpuRange(query, options.upLimit, options.downLimit);
      this.addTimeInterval(query, options.startDate, options.endDate);
      query.then((results) => {
        resolve(parseToJsonPlace(results));
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
  addCpuRange(query, upLimit, downLimit) {
    if (upLimit) {
      query.andWhere('cpu_usage', '<', upLimit);
    }
    if (downLimit) {
      query.andWhere('cpu_usage', '>', downLimit);
    }
    return query;
  }
}

function parseToJsonPlace(json) {
  const response = {};
  json.forEach((result) => {
    response[result.place_id] = {
      cpu_usage: {
        avg: result['AVG(Cpu_usage)'],
        max: result['MAX(Cpu_usage)'],
        min: result['MIN(Cpu_usage)'],
      },
      free_memory: {
        avg: result['AVG(Free_memory)'],
        max: result['MAX(Free_memory)'],
        min: result['MIN(Free_memory)'],
      },
    };
  });
  return response;
}

const instance = new Router_stats();

module.exports = instance;
