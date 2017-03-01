var debug = require('debug')('*** Application Setup ***')
var reader = require('fs').readFile;
var parser = require('json-parse-async');
var resolver = require('path').resolve;
const Glue = require('glue');
const apiSetup = require('./api.setup');
const webSetup = require('./web.setup');

(function(reader, parser, resolver) {
  var manifestFilename = resolver(__dirname, './manifest.json');

  reader(manifestFilename, 'utf8', function(error, content) {
    if (error) {
      debug(`Error when loading '${manifestFilename}' content`);
    }

    parser(content)
      .then((manifest) => {
        var options = {
          relativeTo: resolver(__dirname, '../../')
        };

        Glue.compose(manifest, options, (error, server) => {
          if (error) {
            debug(`Error when processing '${manifestFilename}' content`);
          }

          server.start(() => {
            apiSetup(server.select('api'));
            webSetup(server.select('web'));

            server.log('info', `Web API running at ${apiServer.info.uri}`);
            server.log('info', `Web application running at ${webServer.info.uri}`);
          });
        });
      })
      .catch((error) => {
        debug(`Error when parsing '${manifestFilename}' content`);
      });
  });

})(reader, parser, resolver);
