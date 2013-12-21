# react-view

This is a module designed to be used as an express 3.x view engine middleware.
With this module, the views folder of your project should include `.jsx` files
that define a react component that should act as your page. See examples for 
more details.

# installation

Currently, this module isn't on npm. In the meantime, you can install it by
adding this dependency to your package.json (or by using the url with a 
standard `npm install` command):

```json
{
  "dependencies": {
    "react-view": "git://github.com/thedekel/react-view.git",
    "amdefine: "*",
    "react": "*",
    "express": "3.x"
  }
}
```

Since this is an express 3.x view engine you'll naturally also need to have
express 3.x in your project's dependencies. Since the files are rendered on your 
server, you'll need to make sure that you have the react as a part of your project
as well. `amdefine` is used in the example code in order to make sure that the
view files can be executed on both the server and the client without modification.
To accomplish that, I'm using RequireJS, and in the interest of not requiring 
requireJS (lol) on the server, I'm using amdefine which allows node to run AMD
modules written in the RequireJS style. More on this later.


# Usage

You can use the module to simply pre-render a react view on the server and then
roll-out your own method to render the same view on the client. In the provided
example and in my personal usage of the module, I'm using the RequireJS to load
the view files on the client, and I've included some lightweight javascript
code that will make a simple "bridge" of sorts, allowing the code to render your
views to be written once and executed on both the client and the server without
any real changes. The steps to set it up are as follows:

## create your main Express app

Assuming you already included the dependencies specified above in your project,
you'll need to make sure that you do a few things in your app's main javascript
file, in this example `index.js`:

```javascript
var express = require('express'),
    react_view = require('react-view');

var app = express();

app.configure(function() {
  app.set('view engine', 'jsx');
  app.engine('jsx', react_view.__express);
  app.set('views', __dirname + '/public');
  app.use(express.static('./public'));
});

react_view.configRoutes(app);

//set up your typical app routes here

app.listen(8000);
```

The important part of this sample is within the `app.configure()` call.
In this example, I'm first telling express that the extension on my
view files is `.jsx`. The files are actually plain javascript files that
will be compiled from jsx through Facebook's JSXTransformer, but in This case
I'm using the `.jsx` extension anyway just to differentiate from javascript
files and javascript react-views. You can replace `"jsx"` with `"js"` both
times it appears in the example if you prefer your react-view files to have
a `.js` extension.

After setting up the view engine extension type, I'm associating the react-view
module that has been loaded at the top of the file with the `.jsx` file type.
After this, I'm defining my views folder as `./public` which is a common choice
for storing publicly available html, js, and css files in Express apps, and
setting up that same folder as the location for static files. You can store your
view files and set up your static folder in a different location if you'd like.
In this case, both folders need to be exactly the same in order for the provided
ajax adapter to work.

After configuring the app, I'm making a call to `react_view.configRoutes(app);`
in order to define some basic client-side javascript files as routes of your
main app. These two files are `/react_view/loader.js` and `/react_view/requester.js`
which together with RequireJS will allow your app to seamlessly render on the client
and server and allow views to be loaded through ajax.

### Note on storing your view files publicly

Typically template files that are used to generate views are not stored in a 
publicly accessible location. In this case, I designed the ajax adapter
to serve the view files to the client in the interest of running the exact same
code on both the client and the server. To do that, I made the intentional
decision to require that the view files will be publicly accessible and that
the root views folder and the static files folder will be the same. Since we
want the views to be generated on both the server and the client, it's important
to make sure that no sensitive code or data is passed into the view when you
use it to generate a response. You should sanitize your data before passing it
to the view engine through the `res.render()` function. I've already come up
with a way to allow sensitive functions to execute on the server and not on
the client, but I believe that doing so is never really necessary since a view
should not be responsible for deciding if information is privileged or not.

## Add Require.js to your project

If you choose to use the provided method for setting up `/react_view/loader.js` and
`/react_view/requester.js`, you will want to use RequireJS. You can get the file
from the [project's download page](http://requirejs.org/docs/download.html).
Place the file somewhere in your project's public folder and make sure that your 
base react-view includes RequireJS and `/react_view/loader.js` as your `data-main`
file. For example, your generated view for a page should include the following
script tag in the head:

```html
<script src="/vendor/require.js" type="application/javascript" data-main="/react_view/loader.js"></script>
```

in this case, my `public` folder contains a folder named `vendor` in which I 
saved the `require.js` file that I downloaded from RequireJS's download page.

## Define routes and templates

After setting up an express app and RequireJS, you can start writing your
views. A react-view file is a RequireJS-style AMD module who's export is
simply a React Component representing a whole page (including the `<html>`,
`<head>`, and `<body>` tags). Since this page is rendered on the server it
will need to include sufficient javascript to actually load the code that
generated the view to the client and execute it. If you choose to use
the provided ajax adapter, the sample `<script>` tag in the previous section
is probably all you need.

Here's an example `home.jsx` file:

```js
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/** @jsx React.DOM */

define(['react'], function(React) {
  var exports = React.createClass({
    render: function() {
      return <html>
        <head>
          <title>Hello World</title>
          <script src="/vendor/require.js" type="application/javascript" data-main="/react_view/loader.js"></script>
        </head>
        <body>
          <h1>Hello World!</h1>
          <p>This page will be rendered on the server, and then again on the client!</p>
        </body>
      </html>;
    }
  });

  return exports;
});
```

If this file is saved in your project's `./public/js/views/home.jsx` and you 
followed all of the explanation above, you can add a corresponding express path
handler in your `index.js`:

```js
app.get('/', function(req, res) {
  res.render('js/views/home', {xhr: req.xhr});
});
```

The addition of `xhr: req.xhr` is used to designate when the page was requested
through an XMLHttpRequest. The ajax adapter that's included in the module will
set it up so that by using this, you can easily make your app a single-page-app
and use ajax to load new views to the client and render them. The options object
that's passed as the second parameter to `res.render` is passed as-is to your
React component as its `props`, on both the client and the server. In order to
ensure that the checksums for both the server-rendered view and the client-rendered
view match up, you will want to make sure that your React component only uses
information from the props and state that's generated through `getInitialState`
in the `render` method. Additional modifications to the component should happen
in other lifecycle methods such as `componentDidMount`.

### amdefine

Initially, I designed the module so that the views can be written to work With
standard node.js `require()` function calls. Since I'm using RequireJS to 
generate the same views on the client, I needed to switch to the `define()` format
that's used above. This necessitated the addition of the npm module `amdefine` and that
each file that's designed to run both on the server and client will have the first line of

```js
if (typeof define !== 'function') { var define = require('amdefine')(module) }
```

RequireJS's optimizer will get rid of this line when it loads a file in the client, but
it should allow npm modules to be loaded and defined through RequireJS's `define()` format
on the server.

Since analogous AMD systems are thus in place on both the client and the server, you can
split your views into multiple reusable components and load them using relative paths.
See the code provided in the `example` folder of this repo to see how I split my page 
layout and content into multiple files.

## using /react_view/requster.js on the client

In order to make using ajax requests for a whole page easier, the included
`requester.js` file can be used. In the example provided in this repo, I set 
up a simple event handler that used it to change a page to particular path:

```js
var Component = React.createClass({
  render: function() {
    return <a onClick={this.loadPage.bind(this, '/some/path')} href='/some/path'>Click Here</a>;
  },
  loadPage: function(path, e) {
    e.preventDefault();
    require(['/react_view/requester.js'], function(requester) {
      requester.changePage(path);
    });
  }
});
```

By requiring `react_view/requester.js` and using the `changePage(path)` method,
you cause an ajax request to ask for the corresponding page, and then render it,
overwriting the current page and making the minimum required DOM mutations needed
to render the new page. The fallback of directing to the same path using a
standard `<a href="/some/path">` will allow your app to be functional even if react.js
hasn't been downloaded to the client or if javascript is disabled or not compatible with
the client.

The requester module will also make sure that your history state is pushed using
the HTML5 hisory push/pop-state specification.
