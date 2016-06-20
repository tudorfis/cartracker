var express = require('express'),
    app = express(),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    server = require('http').createServer(app);

app.use(express.static('./app/'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});


var port = 8082;
server.listen(port);
console.log('http://localhost:'+ port +' app started !');