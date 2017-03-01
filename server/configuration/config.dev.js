var path = require('path');

const config = {
  core: {
    appName: 'development blog'
  },
  database: {
    host: 'localhost',
    port: 3307,
    user: 'blogger',
    password: 'ruby1.9.3',
    database: 'blog',
    pooling: {
      connectionLimit: 10
    }
  },
  auth: {
    serverKey: path.resolve(__dirname, './keys/server-key.pem'),
    expirationSpan: '4h'
  }
};

module.exports = config;
