var Promise = require('bluebird');

var BaseRepository = function BaseRepository() {
  var pool;

  var __getConnection = function __getConnection() {
    return new Promise(function(resolve, reject) {
      if (!pool) {
        return reject('error: not SQL pool available');
      }

      pool.getConnection(function(error, connection) {
        if (!error) {
          return resolve(connection);
        }

        reject(error);
      });
    });
  };

  return {
    setPool: function setPool(connectionPool) {
      pool = connectionPool;
      return this;
    },
    connection: function connection() {
      return __getConnection();
    },
    release: function release(connection) {
      connection.release();
    }
  };
};

module.exports = BaseRepository;
