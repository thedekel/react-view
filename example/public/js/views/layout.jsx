if (typeof define !== 'function') { var define = require('amdefine')(module) }
/** @jsx React.DOM */

define(['react'], function(React) {
  var layout = React.createClass({
    render: function() {
      return React.DOM.html({},
        React.DOM.head({}, 
          React.DOM.title({},this.props.title), 
          React.DOM.script({
            src: '/vendor/require.js', 
            type:'application/javascript', 
            'data-main': '/react_view/loader.js'
          })
        ),
        React.DOM.body({}, 
          this.props.children
        )
      );
    }
  });

  return layout;
});
