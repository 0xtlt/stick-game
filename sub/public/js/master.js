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
        }
    },

    data: {
        msg: 'Welcome to the Home',
        pseudo: ''
    }
})

var game = new Vue({
    el: '#game'
})