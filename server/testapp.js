var express = require('express');
var app = express();
var port = 8081;

app.get('/', (req, res) => res.send('hello world'));

//listen to port 8081 by default
app.listen(process.env.PORT || port);

module.exports = app;
