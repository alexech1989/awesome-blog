var path = require('path');

const config = {
  core: {
    appName: 'local blog'
  },
  database: {
    host: 'localhost',
    port: 3306,
    user: 'blogger',
    password: 'ruby1.9.3',
    database: 'blog',
    pooling: {
      connectionLimit: 5
    }
  },
  auth: {
    serverKey: path.resolve(__dirname, './keys/server-key.pem'),
    expirationSpan: '1h'
  }
};

module.exports = config;
