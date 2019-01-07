
const path = require('path');

exports.success = function (text, keys, values) {
  const json = {
    message: text,
  };

  if (Object.prototype.toString.call(keys) === '[object Array]') {
    for (let i = 0; i < keys.length; i++) {
      json[keys[i]] = values[i];
    }
  } else {
    json[keys] = values;
  }
  return json;
};

exports.error = function buildErrorJSON(err) {
  const json = {
    error: err,
  };
  return json;
};

exports.errorPath = function () {
  if (process.env.PRODUCTION) {
    // Do something to return page not found or invalid input
  }
  return path.join(__dirname, '../', '../', 'client', 'views', 'error.ejs');
};
