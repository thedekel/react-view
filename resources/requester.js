define(['react'], function(React) {
  var exports = {};
  var loadPage = function(path, method, formData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var jsonRes = JSON.parse(xhr.responseText);
          if (jsonRes.viewfile && jsonRes.viewdata) {
            return require(['react',jsonRes.viewfile], 
              function(react, Component) { 
                React.__internals.Mount.allowFullPageRender = true; 
                React.renderComponent( Component(jsonRes.viewdata), document) 
              }
            );
          }
          console.log('server response is malformed! please return a JSON ' +
            'object with `viewfile` and `viewdata`');
        } catch (e) {
          console.log("error loading view!");
        }

      }
    };
    xhr.open(method, path, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(formData);
  }
  exports.loadCurrentPage = function() {
    return loadPage(document.location.pathname, "GET", null);
  };
  exports.changePage = function(pagepath) {
    console.log("TODO: replace history state and set-up popstate");
    return loadPage(pagepath, "GET", null);
  };
  exports.submitForm = function(form) {
    var fd = new FormData(form);
    var method = form.method;
    var path = form.action;
    return loadPage(path, method, fd);
  };
  return exports;
});
