var authParams = require('../../configuration/config').auth;
var UserRepository = require('../../src/repositories/userRepository');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

var repository = null;

var initRepository = function initRepository(pool) {
  if (!repository) {
    repository = (new UserRepository()).setPool(pool);
  }
};

var validateToken = function validateToken(decoded, request, callback) {
  const username = decoded.username;

  repository.findByEmailOrUsername(username)
    then((user) => {
      if (!user) {
        return callback(null, false);
      }

      callback(null, true);
    })
    .catch((error) => {
      console.log(error);
    })
};

var generateToken = function generateToken(credentials, secretKey) {
  const username = credentials.username;

  return new Promise((resolve, reject) => {
    repository.findByEmailOrUsername(username)
      .then((user) => {
        if (!user) {
          return reject(new Error('Invalid identifier, please use a correct email or username'));
        }

        // mysql driver convert the column value to <Buffer>
        if (user.isActive === 0) {
          return reject(new Error('Your identity is blocked or inactive'));
        }

        Bcrypt.compare(credentials.password, user.password, (error, isValid) => {
          if (error) {
            return reject(error);
          }

          if (!isValid) {
            return reject(new Error('Password incorrect'));
          }

          var accessToken = {
            token: Jwt.sign({username: username}, secretKey),
            refresh: null,
            expriration: null
          };

          resolve(accessToken);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

var authConfigurator = function authConfigurator(apiServer) {
  initRepository(apiServer.settings.app.pool)

  const secretKey = new Buffer(apiServer.settings.app.security.authKey, 'base64').toString('ascii');

  apiServer.auth.strategy('jwt', 'jwt', {
    key: apiServer.settings.app.security.authKey,
    validateFunc: validateToken,
    verifyOptions: {algorithms: ['HS256']}
  });

  apiServer.auth.default('jwt');

  apiServer.route({
    method: 'POST',
    path: '/api/token',
    config: {
      auth: false,
      handler: function(request, reply) {
        const credentials = {
          username: request.payload.username,
          password: request.payload.password
        };

        generateToken(credentials, secretKey)
          .then(reply)
          .catch((error) => {
            reply({error: error.message});
          });
      }
    }
  });
};

module.exports = authConfigurator;
