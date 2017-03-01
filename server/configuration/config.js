const debug = require('debug')('*** Configuration Management ***');
var fileChecker = require('fs').statSync;
var assigner = require('lodash').assign;
var resolver = require('path').resolve;

var config = (function(fileChecker, assigner, resolver, env) {
  env = env || 'dev';
  const localFilename = resolver(__dirname, './config.local.js');
  var config = require('./config.' + env);

  try {
    var stats = fileChecker(localFilename);

    if (stats.isFile()) {
      config = assigner(config, require('./config.local'));

      debug(`File '${localFilename}' found`);
    }
  } catch (e) {
    debug(`File '${localFilename}' not found`);
  }

  return config;
})(fileChecker, assigner, resolver, process.env.NODE_ENV);

module.exports = config;
