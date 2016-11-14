$('#savenote').prop("disabled", true);

// When the value of the text area changes...
$("#newbodyinput").on("input", function() {
    // If there's at least one character...
    if ($(this).val().length > 0) {
        // Enable the button.
        $("#savenote").prop("disabled", false);
    } else {
        // Else, disable the button.
        $("#savenote").prop("disabled", true);
    }
});


// Code to process clicking on text within a <p> tag
$(document).on("click", 'p', function () {
    var $newNote = $('#newbodyinput');
    var $headline = $('#headline');
    var $savedNotes = $('#savedbodyinput');

    // Empty the notes section to be ready for the new article notes
    $savedNotes.empty();
    $newNote.empty();
    // $headline.empty();

    // Save the id from the <p> tag
    var thisId = $(this).attr('data-id');

    // Use Ajax to get the article and note info
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .done(function (data) {
            console.log("article data: ", data);
            // Set the headline so we know which article's notes we are looking at
            $headline.html(data.title);
            // Update the save note button with the current article id
            $('#savenote').attr('data-id', data._id);

            // Since there can be multiple notes for a single article, need to
            // query for the notes after clicking, which maybe can be part of the
            // get /articles/id route? Let's see what that can return...
            $.ajax({
                method: "GET",
                url: "/notes/" + thisId
            })
                .done(function (data) {
                    console.log("note data:", data);
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (typeof data[i].body !== "undefined") {
                                $savedNotes.append(data[i].body + "\n");
                            }
                        }
                    }
                })
        });
});

// Save a note
$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr('data-id');

    var noteText = $('#newbodyinput').val();

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: noteText
        }
    })
        .done(function (data) {
            console.log("after ajax post:", data);
            console.log("noteText:", noteText);
            // Append the new note to the existing notes
            $('#savedbodyinput').append(noteText + "\n");
        });
    // Clear the newbodyinput text
    $('#newbodyinput').val("");
});