var compileSass = require('express-compile-sass'),
express = require('express'),
app = express(),
server = require('http').createServer(app),
session = require('express-session'),
cookie = require('cookie'),
cookieParser = require('cookie-parser'),
sessionStore = new session.MemoryStore(),
root = process.cwd();

var COOKIE_SECRET = '5aKjfqQWADepP5dzi2e7QTCv2ErKhJx8xFSawx7D';
var COOKIE_NAME = 'sid';

/* Here we stock all games data */

var game_data = [

]

const default_game = {
    name: '',
    id_one: {id: 0, pseudo: ''},
    id_two: {id: 0, pseudo: ''},
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
        logToConsole: false // If true, will log to console.error on errors
    }));


var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    var data = socket.handshake || socket.request;
    if (! data.headers.cookie) {
        return next(new Error('Missing cookie headers'));
    }
    var cookies = cookie.parse(data.headers.cookie);

    console.log('Un client est connecté !');

    socket.on('pseudo', function(data){
        console.log(`${data} cherche une game`)
        search_game(socket, cookies.sid, data);
    })

    socket.on('take', (e) => {
        var repeat_lap = false
        console.log(`At position : col = ${e.sec.col} & block = ${e.sec.block}, change color of the ${e.side} side`)
        r = grep(game_data, (v) => { if(v.name === e.code){ return v } })[0]
        if(r.lap !== cookies.sid){
            return
        }

        if(r.lap === r.id_two.id){
            color = 'red'
        } else {
            color = 'blue'
        }
        //console.log(e.side)
        switch (e.side) {
            case 'left':
                if(r.data[e.sec.col].blocks[e.sec.block].left === 1){
                    break
                }
                r.data[e.sec.col].blocks[e.sec.block].left = 1
                r.data[e.sec.col].blocks[e.sec.block].class += ' left-'+color

                if(r.data[e.sec.col].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[e.sec.block].top === 1 && r.data[(e.sec.col)+1].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[(e.sec.block)+1].top === 1){
                    r.data[e.sec.col].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                if(r.data[(e.sec.col) - 1].blocks[e.sec.block].left === 1 && r.data[(e.sec.col) - 1].blocks[e.sec.block].top === 1 && r.data[(e.sec.col) - 1].blocks[(e.sec.block) + 1].top === 1){
                    console.log('extro')
                    r.data[(e.sec.col) - 1].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                break

            case 'right':
                if(r.data[(e.sec.col)+1].blocks[e.sec.block].left === 1){
                    break
                }
                r.data[(e.sec.col)+1].blocks[e.sec.block].left = 1
                r.data[(e.sec.col)+1].blocks[e.sec.block].class += ' left-'+color

                if(r.data[e.sec.col].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[e.sec.block].top === 1 && r.data[(e.sec.col)+1].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[(e.sec.block)+1].top === 1){
                    r.data[e.sec.col].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                if(r.data[(e.sec.col) + 1].blocks[e.sec.block].left === 1 && r.data[(e.sec.col) + 1].blocks[e.sec.block].top === 1 && r.data[(e.sec.col) + 1].blocks[(e.sec.block) + 1].top === 1){
                    console.log('extro')
                    r.data[(e.sec.col) + 1].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                break

            case 'top':
                if(r.data[e.sec.col].blocks[e.sec.block].top === 1){
                    break
                }
                r.data[e.sec.col].blocks[e.sec.block].top = 1
                r.data[e.sec.col].blocks[e.sec.block].class += ' top-'+color

                if(r.data[e.sec.col].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[e.sec.block].top === 1 && r.data[(e.sec.col)+1].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[(e.sec.block)+1].top === 1){
                    r.data[e.sec.col].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                //console.log(`left top = ${r.data[e.sec.col].blocks[(e.sec.block) - 1].left} & top top = ${r.data[e.sec.col].blocks[(e.sec.block) - 1].top} & left top left = ${r.data[(e.sec.col) + 1].blocks[(e.sec.block) - 1].left}`)

                if(r.data[e.sec.col].blocks[(e.sec.block) - 1].left === 1 && r.data[e.sec.col].blocks[(e.sec.block) - 1].top === 1 && r.data[(e.sec.col)+1].blocks[(e.sec.block) - 1].left === 1){
                    console.log('extro')
                    r.data[e.sec.col].blocks[(e.sec.block) - 1].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                break

            case 'bottom':
                if(r.data[e.sec.col].blocks[(e.sec.block)+1].top === 1){
                    break
                }
                r.data[e.sec.col].blocks[(e.sec.block)+1].top = 1
                r.data[e.sec.col].blocks[(e.sec.block)+1].class += ' top-'+color

                if(r.data[e.sec.col].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[e.sec.block].top === 1 && r.data[(e.sec.col)+1].blocks[e.sec.block].left === 1 && r.data[e.sec.col].blocks[(e.sec.block)+1].top === 1){
                    r.data[e.sec.col].blocks[e.sec.block].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                if(r.data[e.sec.col].blocks[(e.sec.block) + 1].left === 1 && r.data[e.sec.col].blocks[(e.sec.block) + 1].top === 1 && r.data[(e.sec.col)+1].blocks[(e.sec.block) + 1].left === 1){
                    console.log('extro')
                    r.data[e.sec.col].blocks[(e.sec.block) + 1].class += ' fill-'+color
                    repeat_lap = true
                    if(r.lap === r.id_two.id){
                        r.score.two += 1
                    } else {
                        r.score.one += 1
                    }
                }

                break

            default:
                break
        }

        if(repeat_lap === false){
            if(r.lap === r.id_one.id){
                r.lap = r.id_two.id
            } else {
                r.lap = r.id_one.id
            }
        }

        socket.emit('up', [r.data, r.score, repeat_lap])
        socket.to(e.code).emit('up', [r.data, r.score, repeat_lap])
    })

    socket.on('debug', () => {
        socket.emit('debug', [game_data, default_game])
    })

    socket.on('disconnect', () => {
        console.log("Un client s'est déconnecté")
        /*var end = grep(game_data, (v) => { if(v.id_one === cookies.sid){ return v } else if(v.id_two === cookies.sid){ return v } else { return {name: 'off'} } })[0]
        if(true){
            socket.to(end.name).emit('end', {
                code: 404
            })
        }*/

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

function search_game(socket, sid, pseudo){
    r = grep(game_data, (e) => { if(e.full === false){ return e } })
    if(r.length === 0){
        new_game(socket, sid, pseudo)
    } else {
        join_game(r[0], socket, sid, pseudo)
    }
}

function join_game(game, socket, sid, pseudo) {
    socket.join(game.name)
    game.id_two.id = sid
    game.id_two.pseudo = pseudo
    game.full = true
    socket.emit('join_game', {
        owner: false,
        name: game.name,
        data: game.data,
        lap: false
    })
    socket.to(game.name).emit('ready', pseudo)
    socket.emit('ready', game.id_one.pseudo)
}

function new_game(socket, sid, pseudo){
    random_name = make_room_name()
    socket.join(random_name)
    var new_game = {
        name: '',
        id_one: {id: 0, pseudo: ''},
        id_two: {id: 0, pseudo: ''},
        full: false,
        lap: 0,
        data: [

        ],
        winner: 0,
        score: {
          one: 0,
          two: 0
        },
        finish: false
    }

    //generate columns
    for(n = 0; n < 10; n++){

        var col = {
            col: n,
            blocks: [

            ]
        }

        //generate blocks
        for(i = 0; i < 10; i++){
            col.blocks.push({
                block: i,
                left: 0,
                top: 0,
                fill: false,
                class: ''
            })
        }

        new_game.data.push(col)

    }

    new_game.name = random_name
    new_game.id_one.id = sid
    new_game.lap = sid
    new_game.id_one.pseudo = pseudo
    game_data.push(new_game)
    socket.emit('join_game', {
        owner: true,
        name: random_name,
        data: new_game.data,
        lap: true
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

server.listen(3032, "127.0.0.1");