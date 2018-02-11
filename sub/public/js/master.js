//for debugging

var debug = false
if(debug){
    $('head').prepend('<link rel="stylesheet" href="/assets/css/debugging_design.sass">')
}

//end for

var ingame = {
    code_game: null,
    data: {

    }
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
        InGame: false
    }
})

socket.on('join_game', (e) => {
    ingame.code_game = e.name
    ingame.data = e.data
})

/* for debugging */
function get_server(){
    socket.emit('debug')
}

socket.on('debug', (e) => {
    console.log(e)
})
/* END Debugging */