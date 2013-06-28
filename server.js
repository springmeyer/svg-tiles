#!/usr/bin/env node

var express = require('express');
var fs = require('fs');

var port = 4000;
var app = express();

app.get('/', function(req, res) {
    res.send(require('fs').readFileSync('./index.html', 'utf8'));
});

app.get('/tiles/:z/:x/:y.:format', function(req, res, next) {
    var z = parseInt(req.params.z,10) | 0;
    var x = parseInt(req.params.x,10) | 0;
    var y = parseInt(req.params.y,10) | 0;
    var format = req.params.format;
    var filename = __dirname +'/tiles/'+z+'/'+x+'/'+y+'.'+format;
    var headers = {'Access-Control-Allow-Origin':'*'}
    fs.exists(filename,function(exists) {
        if (exists) {
            fs.readFile(filename,function(err,data){
                if (err) return next(err);
                headers['Content-Encoding'] = 'gzip';
                headers['Content-Type'] = 'image/svg+xml';
                res.set(headers);
                res.send(data);
            });
        } else {
          return next();
        }
    });
});

app.use(express.static(__dirname +'/'));

app.listen(port);

console.log("listening on localhost:"+port)
