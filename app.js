'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_router = require('./router/user');
var artist_router = require('./router/artist');
var album_router = require('./router/album');
var song_router = require('./router/song');
var path = require('path');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});
//rutas base
app.use('/api', user_router);
app.use('/api', artist_router);
app.use('/api', album_router);
app.use('/api', song_router);
app.use('/', express.static('client', {redirect: false}));

module.exports = app;
