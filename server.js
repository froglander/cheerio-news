// Require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");

var mongoose = require("mongoose");

// var moment = require("momentjs");

// Use bodyparser and morgan
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Set up static public directory for css and images, etc
app.use(express.static('public'));

// Set up the mongoose mongodb connection
// Local for dev purposes
// mongoose.connect("mongodb://localhost/cheerio-news");
// Heroku version
mongoose.connect("mongodb://heroku_n5d1ttd3:4oiehtmqju59e1aosgv8du9fkb@ds041160.mlab.com:41160/heroku_n5d1ttd3");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose error:", error);
});

// Message on successful connection
db.once("open", function() {
    console.log("Mongoose connection successful");
});

// Set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
// Set handlebars to be used fore view engine
app.set("view engine", "handlebars");

// Set up routes
var routes = require('./controllers/news-routes.js');
app.use('/', routes);

// Set app to listen to appropriate port
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("App running on port " + port + "!");
});


