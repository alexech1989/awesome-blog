var decodeBase64 = function decodeBase64(encoded) {
  return new Buffer(encoded, 'base64').toString('ascii');
};

var encodeBase64 = function encodeBase64(plain) {
  return new Buffer(plain, 'ascii').toString('base64');
};

module.exports = {
  decodeBase64: decodeBase64,
  encodeBase64: encodeBase64
};
