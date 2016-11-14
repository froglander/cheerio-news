/**
 * Mongoose schema for articles
 */

// require Mongoose
var mongoose = require('mongoose');

// Create Schema class
var Schema = mongoose.Schema;

// Article schema
var ArticleSchema = new Schema({
    // Title is required
    title: {
        type: String,
        required: true
    },
    // Link is required and unique (decided to use link as there is a higher possibility of duplicate titles being okay
    link: {
        type: String,
        required: true,
        unique: true
    },
    dateAdded: String
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// Export the model
module.exports = Article;

