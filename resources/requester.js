define(['react'], function(React) {
  var exports = {};
  exports.loadPage = function(path) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var jsonRes = JSON.parse(xhr.responseText);
          if (jsonRes.viewfile && jsonRes.viewdata) {
            return require(['react',jsonRes.viewfile], 
              function(react, Component) { 
                React.__internals.Mount.allowFullPageRender = true; 
                React.renderComponent( Component(jsonRes.viewData), document) 
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
    xhr.open("GET", path, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }
  exports.loadCurrentPage = function() {
    return exports.loadPage(document.location.pathname);
  };
  exports.changePage = function(pagepath) {
    console.log("TODO: replace history state and set-up popstate");
    return exports.loadPage(pagepath);
  };
  return exports;
});
