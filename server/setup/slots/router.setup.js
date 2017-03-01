const authController = require('../../src/controllers/authController');
const usersController = require('../../src/controllers/usersController');
const postsController = require('../../src/controllers/postsController');

var routerConfigurator = function routerConfigurator(apiServer) {
  /*======================= Auth Module Route Definitions =======================*/
    apiServer.route([
      {
        method: 'POST'
      }
    ]);
  /*=============================================================================*/
};
