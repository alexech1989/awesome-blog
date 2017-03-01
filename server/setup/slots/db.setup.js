const dbParams = require('../../configuration/config').database;
const strUtility = require('../../util/utility.string');
var pool = require('mysql').createPool;

var databaseConfigurator = function databaseConfigurator(apiServer) {
  const connectionPool = pool({
    connectionLimit: dbParams.pooling.connectionLimit,
    host: dbParams.host,
    port: dbParams.port,
    user: dbParams.user,
    password: strUtility.decodeBase64(dbParams.password),
    database: dbParams.database
  });

  apiServer.settings.app.pool = connectionPool;
};

module.exports = databaseConfigurator;
