'use strict'

var path = require('path');
var fs = require('fs');
var Song = require('../models/song');
var Album = require('../models/album');

//Usamos los modulos para leer archivo lrc
var fs = require('fs');
var parseLcr = require('parse.lrc');

function getSong(req, res){
  var songId = req.params.id;
  Song.findById(songId).populate({path: 'album'}).exec((err, song) =>{
    if(err){
      res.status(500).send({message: 'Error en la peticion.'});
    }else{
      if(!song){
        res.status(404).send({message: 'La cancion no existe.'});
      }else{
        res.status(200).send({song});
      }
    }
  });
}

function getSongs(req, res){
  var albumId = req.params.album;
  if(!albumId){
    //Listamos canciones por artista?
    var find = Song.find().sort('number');
  }else{
    //Listamos canciones por album
    var find = Song.find({album: albumId}).sort('number');
  }

  find.populate({
    path: 'album',
    populate: {
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, songs) =>{
    if(err){
      res.status(500).send({message: 'Error en la peticion.'});
    }else{
      if(!songs){
        res.status(404).send({message: 'No existe la cancion.'});
      }else{
        res.status(200).send({songs});
      }
    }
  });
}

function saveSong(req, res){
  var params = req.body;
  var song = new Song();
  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion.'});
    }else{
      if(!songStored){
        res.status(404).send({message: 'Error al guardar la cancion.'});
      }else{
        res.status(200).send({song: songStored});
      }
    }
  });
}

function updateSong(req, res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
    if(err){
      res.status(500).send({message: 'Error en la peticion.'});
    }else{
      if(!songUpdated){
        res.status(404).send({message: 'La cancion no se actualizo.'});
      }else{
        res.status(200).send({song: songUpdated});
      }
    }
  });
}

function deleteSong(req, res){
  var songId = req.params.id;
  Song.findByIdAndRemove(songId, (err, songRemoved) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion.'});
    }else{
      if(!songRemoved){
        res.status(404).send({message: 'No se ha eliminado la cancion.'});
      }else{
        res.status(200).send({song: songRemoved});
      }
    }
  });
}

function uploadSongFile(req, res){
  var songId = req.params.id;
  var file_name = 'No subido...';

  if(req.files){
    var file_path = req.files.file.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'mp3' || file_ext == 'ogg'){
      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
        if(err){
          res.status(500).send({message: 'Error en la peticion.'});
        }else{
          if(!songUpdated){
            res.status(404).send({message: 'No se pudo actualizar el archivo de la cancion.'});
          }else{
            res.status(200).send({song: songUpdated});
          }
        }
      });
    }else{
      res.status(200).send({message: 'Extension del archivo invalido.'});
    }
  }else{
    res.status(200).send({message: 'No ha subido ningun archivo.'});
  }
}

function getSongFile(req, res){
  var songFile = req.params.songFile;
  var path_file = "./uploads/songs/" + songFile;

  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(404).send({message: 'No existe el archivo de musica.'});
    }
  });
}

function uploadSongLyric(req, res){
  var songId = req.params.id;
  var file_name = "Sin Letra...";

  if(req.files){
    var file_path = req.files.lyric.path;
    var file_split = file_path.split('/');
    file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if(file_ext == 'lrc'){
      Song.findByIdAndUpdate(songId, {lyric: file_name}, (err, songUpdated) => {
        if(err){
          res.status(500).send({message: 'Error en la peticion.'});
        }else{
          if(!songUpdated){
            res.status(404).send({message: 'No se pudo actualizar el archivo de la letra de la cancion.'})
          }else{
            res.status(200).send({song: songUpdated});
          }
        }
      });
    }else{
      res.status(200).send({message: 'Extension del archivo invalido.'});
    }
  }else{
    res.status(200).send({message: 'No ha subido ningun archivo.'});
  }
}

function getSongLyric(req, res){
  var songLyric = req.params.songLyric;
  var path_file = "./uploads/lyrics/" + songLyric;

  fs.exists(path_file, function(exists){
    if(exists){
      //Leemos el archivo Lrc
      var lrcData = fs.readFileSync(path_file,'utf-8');
      var lrc = parseLcr(lrcData);
      res.status(200).send({letra:lrc});
    }else{
      res.status(404).send({message: 'No existe el archivo de musica.'});
    }
  });

}

module.exports = {
  getSong,
  getSongs,
  saveSong,
  updateSong,
  deleteSong,
  uploadSongFile,
  getSongFile,
  uploadSongLyric,
  getSongLyric
}
