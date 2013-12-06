var util = require('util');

exports.load = function(str) {
  return function(locals) {
    return 'FILE:\n' + str + '\n\n\nLOCALS:\n' + util.inspect(locals);
  }
}
