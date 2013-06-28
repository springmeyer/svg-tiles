#!/usr/bin/env node

var express = require('express'),
    fs = require('fs'),
    stream = require("stream"),
    zlib = require("zlib"),
    expat = require("node-expat");

var port = 4000;
var app = express();

//# simplifyStream
//* removes all styling attributes
//* inserts a stylesheet at the top
//* Changes coordinates to integers and removes consecutive duplicates

function simplifyStream() {
  var parser = new expat.Parser("UTF-8"),
      output = new stream.PassThrough();

  parser.on('startElement',function(d,a) {
    var last;
    if (d == 'path')
      a = {
        // Fetch all coordinate pairs
        d : a.d.replace(/\-?\d*\.\d*\s\-?\d*\.\d*/g,function(d) {
          // Round both numbers
          var simple =  d.split(" ").map(function(d) { return Math.round(d);}).join(" ");
          // If the current pair is the same as last one, we ignore
          if (simple === last) return "";
          return (last = simple);
        })
        // Remove multiple spaces
        .replace(/\s\s/g," ").replace(/\s\s/g," ").replace(/\s\s/g," ").replace(/\s\s/g," ")
      };

    else if (d == 'g')
      // Switch id attribute to class attribute
      a = {class:a.id};

    output.push("<"+d+" "+Object.keys(a)
      .map(function(key) {
        return key+'="'+a[key]+'"';
      })
      .join(" ")+">"
    );
    if (d == 'svg')
      // Inject a stylesheet right after the svg tag
      output.push("<style> .landuse { fill:#cceecc} .admin,.waterway {fill:none} .water {fill:#c3e6ff;stroke:none} .tunnel {fill:none;stroke:#ccddee,stroke-width:0.5px} .road {fill:none;stroke-width:0.5px;stroke:#ccddee} .bridge {fill:none;stroke:#ccddee;stroke-width:2px} rect {fill:#ffffff} </style>");
  });

  parser.on('endElement',function(d) {
    output.push("</"+d+">");
  });

  parser.on("end",output.end.bind(output));
  parser.pipe = output.pipe.bind(output);
  return parser;
}

app.get('/', function(req, res) {
    res.send(require('fs').readFileSync('./index.html', 'utf8'));
});

var headers = {
  'Access-Control-Allow-Origin':'*',
  'Content-Encoding' : 'gzip',
  'Content-Type' : 'image/svg+xml'
};

app.get('/tiles/:z/:x/:y.:format', function(req, res, next) {
    var z = +req.params.z | 0;
    var x = +req.params.x | 0;
    var y = +req.params.y | 0;
    var format = req.params.format;
    var filename = __dirname +'/tiles/'+z+'/'+x+'/'+y+'.'+format;
    fs.exists(filename,function(exists) {
        if (exists) {
            res.set(headers);
            fs.readFile(filename,function(err,data){
                if (err) return next(err);
                res.set(headers);
                var stream = fs.createReadStream(filename).pipe(zlib.createGunzip());
                // return full res and floating point geometries with original styling
                stream.pipe(zlib.createGzip()).pipe(res);
                // uncomment to return optimized svg geometries with cleaner styling
                //stream.pipe(simplifyStream()).pipe(zlib.createGzip()).pipe(res);
            });
        } else {
          return next();
        }
    });
});

app.use(express.static(__dirname +'/'));

app.listen(port);

console.log("listening on localhost:"+port)
