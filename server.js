'use strict';

var database_uri = 'mongodb+srv://mikmir7:Aninotzri20@cluster1.dxthi.mongodb.net/Cluster1?retryWrites=true&w=majority'


var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var shortid = require('shortid');

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
mongoose.connect(database_uri,
   { useNewUrlParser: true, useUnifiedTopology: true }); 


 // enable CORS so that your API is remotely testable by FCC
app.use(cors({optionsSuccessStatus: 200}));

//  https:// expressjs.com/en/starter/static-files.html
 app.use(express.static('public'));
 
// express.js basic routing

 app.get("/", function (req, res) {
 res.sendFile(__dirname + '/views/index.html');
 });



// schema and model 
var ShortUrl = mongoose.model('ShortUrl', new mongoose.Schema ({
  short_url: String,
  original_url: String,
  suffix: String
}));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post("/api/shorturl/new", function(req, res) {
  var client_requested_url = req.body.url
  var suffix = shortid.generate();
  var newShortUrl = suffix

  var newUrl = new ShortUrl({
    short_url: __dirname + "/api/shorturl" + suffix,
    original_url: client_requested_url,
    suffix: suffix
  })


  newUrl.save(function(err, doc){
    if (err) return console.error(err);
    res.json({
      "saved": true,
      "short_url": newUrl.short_url,
      "original_url": newUrl.original_url,
      "suffix": newUrl.suffix

    });

  });
});

app.get("/api/shorturl/:suffix", (req, res) => {
  var userGeneratedSuffix = req.params.suffix;
  ShortUrl.find({suffix: userGeneratedSuffix}).then(foundUrls => {
    var urlForRedirect = foundUrls[0];
    res.redirect(urlForRedirect.original_url);
  });
});



  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});