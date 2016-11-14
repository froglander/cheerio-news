/**
 * Mongoose schema for notes
 */

// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Note schema
var NoteSchema = new Schema({
    // the headline is the article associated with the note
    _articleId: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    body: {
        type: String
    }
});

// Create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema);

// Export the Note model
module.exports = Note;

