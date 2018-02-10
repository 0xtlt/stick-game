var compileSass = require('express-compile-sass');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var session = require('express-session');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var sessionStore = new session.MemoryStore();
var root = process.cwd();

var COOKIE_SECRET = '5aKjfqQWADepP5dzi2e7QTCv2ErKhJx8xFSawx7D';
var COOKIE_NAME = 'sid';

/* Here we stock all games data */

var game_data = [

]

var default_game = {
    name: '',
    id_one: 0,
    id_two: 0,
    full: false,
    data: {

    },
    winner: 0,
    finish: false
}

/* END data */

app.get('/', function(req, res) {
    res.render('home.ejs', {});
})

    .use(cookieParser(COOKIE_SECRET))

    .use(session({
        name: COOKIE_NAME,
        store: sessionStore,
        secret: COOKIE_SECRET,
        saveUninitialized: true,
        resave: true,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: null
        }
    }))

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
    var data = socket.handshake || socket.request;
    if (! data.headers.cookie) {
        return next(new Error('Missing cookie headers'));
    }

    console.log('Un client est connecté !');

    socket.on('pseudo', function(data){
        console.log(`${data} cherche une game`)
        search_game(socket);
    })

});


/* All of the functions are here */

function grep( elems, callback, invert ) {
    var callbackInverse,
        matches = [],
        i = 0,
        length = elems.length,
        callbackExpect = !invert;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
        callbackInverse = !callback( elems[ i ], i );
        if ( callbackInverse !== callbackExpect ) {
            matches.push( elems[ i ] );
        }
    }

    return matches;
}

function search_game(socket){
    r = grep(game_data, (e) => { if(e.full === false){ return e } })
    if(r.length === 0){
        new_game(socket)
    } else {
        join_game(r[0], socket)
    }
}

function join_game(game, socket) {
    socket.join(game.name)
    game.full = true
    socket.emit('join_game', {
        name: game.name,
        data: game.data
    })
}

function new_game(socket){
    random_name = make_room_name()
    socket.join(random_name)
    var new_game = default_game
    new_game.name = random_name
    new_game.id_one = session.get('id');
    game_data.push(new_game)
    socket.emit('join_game', {
        name: random_name,
        data: {}
    })
}

function leave_game(game_name, socket) {
    socket.leave(game_name)
    socket.emit('stop')
}

function make_room_name() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/* End functions */

server.listen(80);