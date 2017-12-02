'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload_file_song = multipart({uploadDir: './uploads/songs'});
var md_upload_lyric_song = multipart({uploadDir: './uploads/lyrics'});
var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song/', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload_file_song], SongController.uploadSongFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);
api.post('/upload-lyric-song/:id', [md_auth.ensureAuth, md_upload_lyric_song], SongController.uploadSongLyric);
api.get('/get-song-lyric/:songLyric', SongController.getSongLyric);


module.exports = api;
