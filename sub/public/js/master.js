//for debugging

var debug = false
if(debug){
    $('head').prepend('<link rel="stylesheet" href="/assets/css/debugging_design.sass">')
}

//end for

var ingame = {
    code_game: null,
    data: [

    ]
}

var socket = io.connect('http://localhost:80');

var app = new Vue({
    el: '#home',
    methods: {
        play: function () {
            socket.emit('pseudo', app.pseudo)
            console.log('fait')
            app.isActive = false
            game.isActive = true
        }
    },

    data: {
        msg: 'Welcome to the Home',
        pseudo: '',
        isActive: true
    }
})

var game = new Vue({
    el: '#game',
    data: {
        isActive: false,
        InGame: false,
        adv: '',
        lap: false,
        modal: false,
        data: [

        ],
        selection: {
            col: 0,
            block: 0
        }
    },
    methods: {
        block: function(col, block){
            console.log(`col is ${col} and block is ${block}`)
            game.modal = true
            game.selection.col = col
            game.selection.block = block
        },
        take_stick: function (side) {
            socket.emit('take', {
                sec: game.selection,
                side: side,
                code: ingame.code_game
            })
            game.modal = false
        }
    }
})

socket.on('join_game', (e) => {
    ingame.code_game = e.name
    game.data = e.data
    game.lap = e.lap
})

socket.on('ready', (e) => {
    game.InGame = true
    game.adv = e
})

socket.on('up', (e) => {
    game.data = e
    console.log('Update')
    console.log(e)
})


/*socket.on('end', () => {
    game.InGame = false
    game = {
        code_game: null,
        data: {

        }
    }
})

socket.on('change_lap', () => {
    if(game.lap){
        game.lap = false
    } else {
        game.lap = true
    }
})*/

/* for debugging */
function get_server(){
    socket.emit('debug')
}

socket.on('debug', (e) => {
    console.log(e)
})
/* END Debugging */