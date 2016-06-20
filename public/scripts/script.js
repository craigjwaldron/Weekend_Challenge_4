$(document).ready( function(){
  // console.log("hi from script.js");
  domUpdate();


//--------------------------------------------------------------------------------

  $( "#submitTask").on( "click", function(){
    // console.log("hi from the submit button");

    var newTask = $( "#taskInput" ).val().toUpperCase();

    // console.log( newTask );

// Object....ASSEMBLE!!!!--------------------------------------------------------------------------------
    var newTaskObject = {
      "task": newTask,
      "completed": false
    };

// AJAX Post-------------------------------------------------------------------------------------------------------
  $.ajax( {
    type: "POST",
    url: "/createTask",
    data: newTaskObject,
    success: function(){
      domUpdate();
      // console.log("in /postRoute success");
      },
      error: function(err, exc){
      alert( "POST error: " + err.status );
      }
    }); // End of ajax call
    $('#taskInput').val(''); // Clears input field after submit
  }); // End submit button

  // Delete Button --------------------------------------------------------------------------------

      $( "#outputDiv").on( "click", "#deleteButton", function(){
        console.log("hi from delete button");

        var taskId = {
            'id': $(this).attr('taskId')
          };
          // console.log('this id completed: ' + $(this).attr('taskId'));
          $(this).parent().remove();
        $.ajax( {
          type: "POST",
          url: "/deleteTask",
          data: taskId,
          success: function(){
            // console.log("in /deleteButton success");
            }
          }); // End of ajax call
      }); // End of Delete button function

// Checkbox --------------------------------------------------------------------------------

    $( "#outputDiv").on( "click", "#taskCheck", function(){
      // console.log("hi from taskCheck yo");
      // console.log('this id completed: ' + $(this).attr('taskId'));
      var taskId = {
          'id': $(this).attr('taskId'),
          'completed': $(this).attr('taskId')
        };

        $(this).closest("li").css("background-color", "#b5b5b7");

      $.ajax( {
        type: "POST",
        url: "/updateTask",
        data: taskId,
        success: function(){
          }
        }); // End of ajax call
  }); // End of checkbox function

}); // End Doc.ready jquery

// AJAX Get-------------------------------------------------------------------------------------------------------
var domUpdate = function(){
  $('#outputDiv').empty();
  $.ajax( {
    type: "GET",
    url: "/getTask",
    success: function( data ){
      // console.log("in /getTask success");
      showTask ( data );
      } // End success
    }); // End ajax
  }; // End of domUpdate function

  function showTask ( allTasks ){
  // console.log( 'in showTask:' + allTasks );
  for( i=0; i<allTasks.length; i++ ){
    var taskOut = "<p>" + allTasks[i].task + "  Completed: " + allTasks[i].completed + "</p>";
        // $( '#outputDiv' ).append( taskOut );
        $( '.outputDiv ' ).prepend( '<li class="active" id="taskDiv"><input type="checkbox" id="taskCheck" taskId="' + allTasks[i].id + '">'  + allTasks[i].task + '<button type="button" id="deleteButton" taskId="' + allTasks[i].id + '">Delete Task</button></li>' );
        // console.log( "New Task: " + allTasks[ i ].id );
      } // End of loop
    } // End of showTask function
