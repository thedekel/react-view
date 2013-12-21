var express = require('express'),
    react_view = require('react-view');

var app = express();

app.configure(function() {
  //configure view files as .jsx files
  app.set('view engine', 'jsx'); 
  //define the react-view module as the view engine
  app.engine('jsx', react_view.__express); 
  //set the views-folder as public (more info in the readme)
  app.set('views', __dirname + '/public');
  //make sure that your public views are available as static files
  app.use(express.static('./public'));
});

//this will configure an express app to work with the provided ajax adapters
react_view.configRoutes(app);

//path handler definitions
app.get('/', function(req, res) {
  //if you use the provided ajax adapters, make sure that you pass in a value
  //for xhr in your view options
  var options = {val: 1, xhr: req.xhr};
  res.render('js/views/home', options);
});

app.get('/second', function(req, res) {
  var options = {val: 2, xhr: req.xhr};
  res.render('js/views/second', options);
});

app.listen(8000);
console.log('server started on port 8000. visit http://localhost:8000/');
