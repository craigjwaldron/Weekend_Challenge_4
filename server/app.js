var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded( { extended: false } );
var pg = require("pg");
var connectionString = 'postgres://localhost:5432/to_do';


// Setting up static page ------------------------------------------------------------------------------------------------------
app.use ( express.static( "public" ));

// Route to index.html (resovled path to html)-------------------------------------------------------------------------------------------------------
app.get ("/", function( req, res ){
  res.sendFile( path.resolve("views/index.html"));
});

// New Task POST -------------------------------------------------------------------------------------------------------
app.post ( "/createTask", urlencodedParser, function ( req, res ){
  console.log( req.body );
// Send new task to data base
  pg.connect( connectionString, function( err, client, done ){
    var query =  client.query ( "INSERT INTO todolist ( task, completed ) VALUES ( $1, $2 )", [ req.body.task, req.body.completed ] );
      done();
      query.on('end', function(){
        console.log("POST END");
      return res.end();
    }); // End query.on
  }); // End of pg
}); // End of post

// Delete POST -------------------------------------------------------------------------------------------------------
app.post ( "/deleteTask", urlencodedParser, function ( req, res ){
// Send new task to data base
  pg.connect( connectionString, function( err, client, done ){
    console.log(req.body.id);
    var query =  client.query ( 'DELETE from todolist where id=' +req.body.id+ ';' );
    done();
      query.on('end', function(){
      return res.end();
    }); // End query.on
  }); // End of pg
}); // End of post

// Delete POST -------------------------------------------------------------------------------------------------------
app.post ( "/updateTask", urlencodedParser, function ( req, res ){
// Send new task to data base
  pg.connect( connectionString, function( err, client, done ){
    console.log(req.body.id);
    var query =  client.query ( 'UPDATE todolist set completed=true where id=' +req.body.id+ ';' );
    done();
    res.end();
  }); // End of pg
}); // End of post

// GET -------------------------------------------------------------------------------------------------------

app.get ( "/getTask", urlencodedParser, function ( req, res ){
  console.log( "Hello from getTask app.get" );

  var allTasks = [];

  pg.connect ( connectionString, function ( err, client, done ){
    var query = client.query ( "SELECT * FROM todolist");
    done();
    var rows = 0;
    query.on( 'row', function ( row ){
    allTasks.push( row );
      });
    query.on( 'end', function (){
    return res.json( allTasks );
    });
  }); // End pg.connect function
}); // End of app.get

// On the server-------------------------------------------------------------------------------------------------------
app.listen(process.env.PORT || 3000, function(req, res){
  // console.log( "listening from server 3000" );
});
