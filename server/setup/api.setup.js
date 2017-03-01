var dbSetup = require('./slots/db.setup');
var authSetup = require('./slots/auth.setup');

var apiConfigurator = function apiConfigurator(apiServer) {
  dbSetup(apiServer);
  authSetup(apiServer);
};

module.exports = apiConfigurator;
