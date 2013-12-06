var fs = require('fs'),
    path = require('path');

var Instance = function() {

  this.react_render = require('./render');

  this.cache = {};
  this.__express = middleware.bind(this);
};

// express 3.x template engine compliance
function middleware(filename, options, cb) {
  var cache = this.cache;
  var react_render = this.react_render;

  var extension = path.extname(filename);

  function render_file(locals, cb) {
    var template = cache[filename];
    if (template) {
      return cb(null, template(locals));
    }

    fs.readFile(filename, 'utf8', function(err, str) {
      if (err) {
        return cb(err);
      }

      var template = react_render.load(str);
      if (options.cache) {
        cache[filename] = template;
      }

      var res = template(locals);
      cb(null, res);
    });
  }

  return render_file(options, cb);
};

module.exports = new Instance();
module.exports.create = function() {
  return new Instance();
};
