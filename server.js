/**
 * Created by Kristi Heredia on 11/4/2016.
 */

// Require our dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Use morgan and bodyparser with the app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Need static public directory for css and images and such
app.use(express.static('public'));

// Set up the mongoose mongodb connection
// mongoose.connect("mongodb://localhost/cheerio-news");
mongoose.connect("mongodb://heroku_n5d1ttd3:4oiehtmqju59e1aosgv8du9fkb@ds041160.mlab.com:41160/heroku_n5d1ttd3");
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function(err) {
    console.log("Mongoose error:", err);
});

// Successful connection message
db.once("open", function() {
    console.log("Successful Mongoose connection");
});

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
// Set it to use handlebars for views
app.set('view engine', 'handlebars');


var routes = require('./controllers/articles.js');
app.use('/', routes);




// Make sure to use the || so it works both locally and once
// you have deployed to heroku
var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('App running on port ' + port + '!');
});
