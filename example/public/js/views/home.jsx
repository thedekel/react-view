if (typeof define !== 'function') { var define = require('amdefine')(module) }
 /** @jsx React.DOM */

define(['react', './layout.jsx'], function(React, Layout) {
  var index = React.createClass({
    render: function() {
      return Layout({title:'home page'},
        React.DOM.h1({},'Home Page'),
        React.DOM.p({},"This page has (likely) been rendered on the server " +
          "which is why you were able to see the content before react.js " +
          "loaded by the client! If you click on the link below before " +
          "the client has finished loading react.js and initializing the "+
          "view, you'll be simply redirected through a standard anchor " +
          "href. However, if you wait for the view to render on the " +
          "client, the link will have an alternate onClick handler which " +
          "will load the requested page through ajax. Any subsequent " +
          "requests to this or the other page will no longer require the " +
          "view file to be loaded, and only view-data will be loaded from " +
          "the server."),
        React.DOM.a({href: '/second', onClick: this.loadPage.bind(this, '/second')},'to second page')
      );
    },
    loadPage: function(path, e) {
      e.preventDefault();
      require(['/react_view/requester.js'], function(requester) {
        requester.changePage(path);
      });
    }
  });

  return index;
});
