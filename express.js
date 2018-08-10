var path = require('path');
var express = require('express')
var app = express()

// Set default port for ExpressJS web-server
app.set('port', 9000);

// Set Document Root for ExpressJS web-server
app.use(express.static(path.join(__dirname, 'public')));

// Read default port value
var port = app.get('port')

// Start ExpressJS web-server
app.listen(port, function () {
  console.log('Application started on port ' + port)
})
