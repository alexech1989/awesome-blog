'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Bcrypt = require('bcrypt');
const Basic = require('hapi-auth-basic');
const JwtAuth = require('hapi-auth-jwt2');
const Jwt = require('jsonwebtoken');

const server = new Hapi.Server();
server.connection({
  address: 'localhost',
  port: 8000
});

// Fake users db
const users = {
  'alexech1989': {
    username: 'alexech1989',
    password: '$2a$10$Kl4uuI95hEcKlc/ZzmECT.KcX7/Ou7LWJd/10PUKooQOj0JtWXjMG',
    name: 'Daniel Echevarria',
    id: '123456',
    role: 'employee',
    job: 'Software Developer'
  }
};

/*========================== Basic Auth Mechanism ==========================*/
// Auth validation function
const validate = function(request, username, password, callback) {
  const user = users[username];

  if (!user) {
    return callback(null, false);
  }

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid, {id: user.id, name: user.name});
  });
};

// Register the plugin
server.register(Basic, (err) => {
  if (err) {
    throw err;
  }

  server.auth.strategy('simple', 'basic', {validateFunc: validate});

  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'simple',
      handler: function(request, reply) {
        reply(`Hello, ${request.auth.credentials.name}`);
      }
    }
  })
});
/*==========================================================================*/

/*=========================== JWT Auth Mechanism ===========================*/
// Secret or private key
const privateKey = 'P@$$w0Rd';

// Auth validation function
const validateJwt = function(decoded, request, callback) {
  const user = users[decoded.username];

  if (!user) {
    return callback(null, false);
  }

  return callback(null, true);
};

// Jwt generator function
const generateJwt = function(payload, privateKey) {
  return Jwt.sign(payload, privateKey);
};

// Register the plugin
server.register(JwtAuth, (err) => {
  if (err) {
    throw err;
  }

  server.auth.strategy('jwt', 'jwt', {
    key: privateKey,
    validateFunc: validateJwt,
    verifyOptions: {algorithms: ['HS256']}
  });
  server.auth.default('jwt');

  server.route([
    {
      method: 'POST',
      path: '/token',
      config: {auth: false},
      handler: function(request, reply) {
        reply({
          token: generateJwt({username: 'alexech1989'}, privateKey),
          expiration: 28800,
          refresh: 'gfjshfjhsjkdhf53rwERW$%·%457345$·&$%/&'
        });
      }
    },
    {
      method: 'GET',
      path: '/posts',
      config: {auth: false},
      handler: function(request, reply) {
        const PostRepository = require('./postRepository');
        const db = require('./database');

        (new PostRepository())
          .setPool(db.pool)
          .fetch()
            .then((data) => {
              reply(data);
            })
            .catch((error) => {
              reply(error, error.code);
            });
      }
    },
    {
      method: 'GET',
      path: '/restricted',
      config: {auth: 'jwt'},
      handler: function(request, reply) {
        reply({text: 'You used a Token!'})
          .header('Authorization', request.headers.authorization);
      }
    }
  ]);
})
/*==========================================================================*/

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    path: '/hello',
    method: 'GET',
    handler: function(request, reply) {
      reply.file('./public/hello.html');
    }
  });
});

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
}, (err) => {
  if (err) {
    throw err;
  }

  server.start(function(err) {
    if (err) {
      throw err;
    }

    server.log('info', `Server running at ${server.info.uri}`);
  });

});
