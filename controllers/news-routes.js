/*
 Routes will include
 get for root '/'
 get for articles that will display json of the articles
 get for article by id
 post for note by article id
 delete for note by article id
 */

// Do I need to re-require stuff that was required in server.js?

// Require our dependencies
var express = require("express");
var router = express.Router();

var moment = require("moment");

// var bodyParser = require("body-parser");
// var logger = require("morgan");
// var mongoose = require("mongoose");
// Need these for scraping
var request = require("request");
var cheerio = require("cheerio");

// Require Note and Article models
var Article = require('../models/Article.js');
var Note = require('../models/Note.js');

// Each time the root is accessed, scrape any new articles
router.get('/', function (req, res) {
    var siteUrl = 'http://www.developer-tech.com';

    // first, grab the body of the html with request
    request(siteUrl, function (error, response, html) {
        // then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // now, grab every h3 within an article tag, and do the following:
        $('article h3').each(function (i, element) {
            // save an empty result object
            var result = {};

            // add the text and href of every link,
            // and save them as properties of the result obj
            result.title = $(this).children('a').text();
            // Had to include the site url with the links because this website
            // uses all internal links which don't work very well from an
            // external site :)
            result.link = siteUrl + $(this).children('a').attr('href');
            result.dateAdded = Date.now();
            // result.dateAdded = moment().format("YYYY-MM-DD");

            // using the Article model, create a new entry.
            // (result) essentially passes the result object to the entry (and the title and link)
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
    // Once new articles are scrapged, query the collection and display all articles
    // sorted in descending order by dateAdded
    Article.find({}).sort({dateAdded: -1}).exec(function (err, articles) {
        if (err) return handleError(err);
        //console.log("mongoose articles:", articles);
        res.render('index', {articles: articles});
    });
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

// Get a single article and its notes
router.get('/articles/:id', function (req, res) {
    // This gets us the article title
    Article.findOne({'_id': req.params.id})
    // .populate('note')
        .exec(function (err, doc) {
            if (err) {
                console.log("Error:", err);
            } else {
                res.json(doc);
            }
        });
});

router.get('/notes/:articleId', function (req, res) {
    Note.find({_articleId: req.params.articleId})
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("note doc:", doc);
                res.json(doc);
            }
        });
});

// Post a note for an article
router.post('/articles/:id', function (req, res) {
    var noteText = req.body.body;
    var newNote = new Note({
        _articleId: req.params.id,
        body: noteText
    });

    newNote.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.send(doc);
        }
    });
});

router.post('/delete/:id', function (req, res) {
    var deleteId = req.params.id;
    console.log("note id to be deleted:", deleteId);

    Note.remove({_articleId: deleteId}, function(err) {
        console.log("Notes removed");
        if (err) {
            console.log(err);
        }
    })
});

module.exports = router;