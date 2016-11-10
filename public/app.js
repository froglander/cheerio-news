// whenever someone clicks a p tag
$(document).on('click', 'p', function () {
    var $newNote = $('#newnote');
    var $headline = $('#headline');
    var $savedNotes = $('#savednotes');
    console.log("on click");
    // empty the notes from the note section
    $savedNotes.empty();
    $newNote.empty();
    $headline.empty();
    // save the id from the p tag
    var thisId = $(this).attr('data-id');

    // now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    // with that done, add the note information to the page
        .done(function (data) {
            console.log(data);
            // the title of the article
            $headline.append('<h2>' + data.title + '</h2>');
            // an input to enter a new title
            // $('#notes').append('<input id="titleinput" name="title" >');
            // a textarea to add a new note body
            // $('#savednotes').append('<textarea id="bodyinput" name="body"></textarea>');
            $newNote.append('<textarea id="newbodyinput" name="body"></textarea>');
            $savedNotes.append('<textarea id="savedbodyinput" name="body"></textarea>');
            // a button to submit a new note, with the id of the article saved to it
            // $('#savednotes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
            $newNote.append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

            // if there's a note in the article
            if (data.note) {
                // place the title of the note in the title input
                // $('#titleinput').val(data.note.title);
                // place the body of the note in the body textarea
                $('#savedbodyinput').val(data.note.body);
            }
        });
});

// when you click the savenote button
$(document).on('click', '#savenote', function () {
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');

    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // title: $('#titleinput').val(), // value taken from title input
            body: $('#newbodyinput').val() // value taken from note textarea
        }
    })
    // with that done
        .done(function (data) {
            // log the response
            console.log(data);
            // empty the notes section
            $('#savednotes').empty();

        });

    // Also, remove the values entered in the input and textarea for note entry
    // $('#titleinput').val("");
    $('#newbodyinput').val("");
});
