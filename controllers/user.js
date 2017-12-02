'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req,res){
  res.status('200').send({
    message: 'Probando una accion del controlador de usuario con el api rest'
  });
}

function saveUser(req,res){
  var user = new User();
  var params = req.body;
  console.log(params);
  user.name = params.name;
  user.surname = params.surname;
  user.email = params.email;
  user.role = 'ROLE_USER';
  user.image =  'null';

  if(params.password){
    //Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, function(err,hash){
      user.password = hash;
      if(user.name != null && user.surname != null && user.email != null){
        //Guardar usuario
        user.save((err, userStored) => {
          if(err){
            res.status(500).send({message:'Error al guardar el usuario.'});
          }else{
            if(!userStored){
              res.status(404).send({message:'No se ha registrado el usuario.'});
            }else{
              res.status(200).send({user:userStored});
            }
          }
        });
      }else{
        res.status(200).send({message:'Rellena todos los campos.'});
      }
    });
  }else{
    res.status(500).send({message: 'Introduce la contraseña'});
  }
}

function loginUser(req, res){
  var params = req.body;
  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) => {
    if(err){
      res.status(500).send({message:'Error en la peticion'});
    }else{
      if(!user){
        res.status(404).send({message:'El usuario no existe'});
      }else{
        //Comprobar contraseña
        bcrypt.compare(password, user.password, function(err, check){
          if(check){
            //devolver los datos del usuario logeado
            if(params.gethash){
              //devolver un token de jwt-simple
              res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              res.status(200).send({user});
            }
          }else{
            res.status(404).send({message:'El usuario no ha podido logearse'});
          }
        })
      }
    }
  });
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  if(userId != req.user.sub){
    console.log('userid: ' + userId + ' -user.sub: ' + req.user.sub);
    return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'})
  }

  User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else{
      if(!userUpdate){
        res.status(404).send({message: 'No se ha podido actualizar el usuario.'});
      }else{
        res.status(200).send({user: userUpdate});
      }
    }
  });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
      var file_path = req.files.image.path;
      var file_split = file_path.split('/');
      var file_name = file_split[2];

      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];

      console.log("Imagen de usuario subida con nombre " + ext_split);

      if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
        User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate) =>{
          if(!userUpdate){
            res.status(404).send({message: 'No se ha podido actualizar la imagen del usuario.'});
          }else{
            res.status(200).send({image: file_name, user: userUpdate});
          }
        });
      }else{
        res.status(200).send({message: 'Extension del archivo no valida'});
      }
    }else{
      res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/' + imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe la imagen...'});
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
