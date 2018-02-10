var compileSass = require('express-compile-sass');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var NodeSession = require('node-session');
var root = process.cwd();

session = new NodeSession({secret: '5aKjfqQWADepP5dzi2e7QTCv2ErKhJx8xFSawx7D'});

/* Here we stock all games data */

var game_data = {

}

var default_game = {
    id_one: 0,
    id_two: 1,
    full: false,
    data: {

    },
    winner: 0,
    finish: false
}

/* END data */

app.get('/', function(req, res) {
    session.startSession(req, res, function() {
        res.render('home.ejs', {});
    })
})

    .use('/assets', express.static('sub/public'))

    .use('/assets/css', compileSass({
        root: 'sub/sass',
        sourceMap: true, // Includes Base64 encoded source maps in output css
        sourceComments: true, // Includes source comments in output css
        watchFiles: true, // Watches sass files and updates mtime on main files for each change
        logToConsole: true // If true, will log to console.error on errors
    }));


var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {

    console.log('Un client est connecté !');

    socket.on('pseudo', function(data){

    })

});


/* All of the functions are here */

function new_game(){

}

/* End functions */

server.listen(80);