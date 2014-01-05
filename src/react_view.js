var fs = require('fs'),
    react = require('react'),
    path = require('path');

var Instance = function() {

  this.cache = {};
  this.__express = middleware.bind(this);
};

var excludeServerData = function(options) {
  delete options.serverData;
  if (options.props) {
    return options.props;
  }
  return options;
};

// express 3.x template engine compliance
function middleware(filename, options, cb) {
  if (options.xhr) {
    return cb(null, JSON.stringify(
      { 
        viewfile: '/' + path.relative(options.settings.views, filename),
        viewdata: excludeServerData(options)
      }
    ));
  }

  var cache = this.cache;

  var extension = path.extname(filename);

  function render_file(locals, cb) {
    componentProps = (locals.props? locals.props: locals);
    var template = cache[filename];
    if (template) {
      react.renderComponentToString(template(componentProps), function(out) {
        return cb(null, out);
      });
    }

    view = require(filename);
    if (!options.cache) {
      if (require.cache[filename]) {
        delete require.cache[filename];
      }
    }
    react.renderComponentToString(view(componentProps), function(out) {
      return cb(null, out);
    });
  }

  return render_file(options, cb);
};

module.exports = new Instance();
module.exports.create = function() {
  return new Instance();
};

module.exports.configRoutes = function(app) {
  app.get('/react_view/loader.js', function(req, res) {
    res.sendfile(path.join(__dirname, '../resources', 'loader.js'));
  });
  app.get('/react_view/requester.js', function(req, res) {
    res.sendfile(path.join(__dirname, '../resources', 'requester.js'));
  });
};
