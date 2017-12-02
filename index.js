'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', function(err,res) {
  if(err){
    throw err;
  }else{
    console.log("Conexion exitosa a la base de datos!");
    app.listen(port, function(){
      console.log("Servidor Musify esta ecuchando por http:///localhost:" + port);
    })
  }
});
