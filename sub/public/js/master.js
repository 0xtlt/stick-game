var ingame = {
    code_game: null,
    data: {

    }
}

$(document).ready(() => {

    var socket = io.connect('http://localhost:80');

    var app = new Vue({
        el: '#home',
        data: {
            msg: 'Welcome to the Home'
        }
    })

    var game = new Vue({
        el: '#game'
    })

})