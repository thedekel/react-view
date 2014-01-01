require.config({
  paths: {
    react: 'http://fb.me/react-0.8.0',
    JSXTransformer: 'http://fb.me/JSXTransformer-0.8.0'
  },
  shim: {
    JSXTransformer: {
      exports: "JSXTransformer"
    }
  }
});

//initialize the current page
require(['/react_view/requester.js'], function(requester) {
  requester.loadCurrentPage();
  window.onpopstate = requester.restoreHistoryPage;
});

