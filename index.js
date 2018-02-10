var compileSass = require('express-compile-sass');
var express = require('express');
var app = express();
var root = process.cwd();

app.get('/', function(req, res) {
    res.render('home.ejs', {});
})

    .use('/assets', express.static('sub/public'))

    .use('/assets/css', compileSass({
        root: 'sub/sass',
        sourceMap: true, // Includes Base64 encoded source maps in output css
        sourceComments: true, // Includes source comments in output css
        watchFiles: true, // Watches sass files and updates mtime on main files for each change
        logToConsole: true // If true, will log to console.error on errors
    }));

app.listen(80);