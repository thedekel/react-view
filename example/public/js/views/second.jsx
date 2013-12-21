if (typeof define !== 'function') { var define = require('amdefine')(module) }
 /** @jsx React.DOM */

define(['react', './layout.jsx'], function(React, Layout) {
  var index = React.createClass({
    render: function() {
      return Layout({title:'hello world'},
        React.DOM.h1({},'second page'),
        React.DOM.p({},"This page was made to show reactivity and a multi "+
          "page setup!"),
        React.DOM.a({onClick: this.loadPage.bind(this, '/'), href: '/'},'to home page')
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
