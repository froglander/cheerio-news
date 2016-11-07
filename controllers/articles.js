/**
 * Created by Kristi Heredia on 11/6/2016.
 */
// Okay, so time to move the routing from server.js to here

// Require our dependencies
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Need these for scraping
var request = require("request");
var cheerio = require("cheerio");


// And we bring in our Note and Article models
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');


// Scrape stories from the presently hard-coded url each time the page is visited
// Might add a "landing" page allowing the user to select from a couple of different
// sites to scrape news links from (need to have sites that have the same format)
router.get('/', function (req, res) {
    // router.get('/scrape', function (req, res) {
    // first, we grab the body of the html with request
    request('https://www.smashingmagazine.com/', function (error, response, html) {
        // then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // now, we grab every h2 within an article tag, and do the following:
        $('article h2').each(function (i, element) {

            // save an empty result object
            var result = {};

            // add the text and href of every link,
            // and save them as properties of the result obj
            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            // using our Article model, create a new entry.
            // Notice the (result):
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            // now, save that entry to the db
            entry.save(function (err, doc) {
                // log any errors
                if (err) {
                    console.log(err);
                }
                // or log the doc
                else {
                    console.log(doc);
                }
            });
        });
    });
    // tell the browser that we finished scraping the text.
    //res.send(index.html);
    // Once we have scraped any new articles (still need to add something so we don't get duplicates)
    // Then query the collection and display all the headlines
    Article.find({}, function (err, articles) {
        if (err) return handleError(err);
        //console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
        console.log("mongoose articles:", articles);
        res.render('index', {articles: articles});
    })


});

// this will get the articles we scraped from the mongoDB and display as json
router.get('/articles', function (req, res) {
    // grab every doc in the Articles array
    Article.find({}, function (err, doc) {
        // log any errors
        if (err) {
            console.log(err);
        }
        // or send the doc to the browser as a json object
        else {
            res.json(doc);
        }
    });
});

module.exports = router;