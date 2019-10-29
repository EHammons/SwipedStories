$(document).on("click", "h5", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
    var dbID = "ObjectId(\"" + thisId + "\")";
    console.log(dbID);
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data) {
        $("#notes").append("<h5>" + data.headline + "</h5>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  // When you click the deletenote button
$(document).on("click", "#deletenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var noteId = thisId.note;
    var dbID = "ObjectId(\"" + noteId + "\")";
    console.log(thisId.note);
    console.log(dbID);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "DELETE",
      url: "/notes/" + noteId,
      data: dbID
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  

$(document).on("click", ".swipeNews", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    });
});