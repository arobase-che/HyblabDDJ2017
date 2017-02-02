// Use strict mode
'use strict';

// Load usefull expressjs and nodejs objects / modules
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

// Minimum routing: serve static content from the html directory
app.use(express.static(path.join(__dirname, 'public')));

// You can then add whatever routing code you need

// This module is exported and served by the main server.js located
// at the root of this set of projects. You can access it by lanching the main
// server and visiting http(s)://127.0.0.1:8080/name_of_you_project/ (if on a local server)
// or more generally: http(s)://server_name:port/name_of_you_project/
module.exports = app;


// Carte avec les différentes régions
app.get('/regions', function (req, res) {
    
    fs.readFile(__dirname + '/public/carte-regions.html', function (error, data) {
        res.write(data);
        res.end();
    });
});

// Graphique montrant l'évolution de la longueur des murs en fonction de l'année
app.get('/mur', function (req, res) {

    fs.readFile(__dirname + '/public/graphique-mur.html', function (error, data) {
        res.write(data);
        res.end();
    });
});

// Carte avec tous les murs
app.get('/carte-murs', function (req, res) {

    fs.readFile(__dirname + '/public/carte-murs.html', function (error, data) {
        res.write(data);
        res.end();
    });
});
