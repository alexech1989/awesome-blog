var path = require('path');

const config = {
  core: {
    appName: 'production blog'
  },
  database: {
    host: 'www.awesomeblog.com',
    port: 3306,
    user: 'blogger',
    password: 'ruby1.9.3',
    database: 'blog',
    pooling: {
      connectionLimit: 25
    }
  },
  auth: {
    serverKey: path.resolve(__dirname, './keys/server-key.pem'),
    expirationSpan: '8h'
  }
};

module.exports = config;
