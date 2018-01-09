// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var configAuth = require('../config/main');

// Create the database connection
//mongoose.connect(configAuth.database, options);
mongoose.Promise = global.Promise;
mongoose.connect(configAuth.database, { useMongoClient: true })
    .then(() => console.error('connection database established'))
    .catch(err => console.error(err));

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  //console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  //console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports.mongodb = mongoose;

module.exports.Viagem = require("./viagens").Viagem;
module.exports.Momento = require("./momentos").Momento;
module.exports.Utilizador = require("./utilizador").User;
module.exports.Classificacao = require("./classificacao").Classificacao;
module.exports.Comentario = require("./comentario").Comentario;
module.exports.BucketList = require("./bucketlist").BucketList;
module.exports.Notificacao = require("./notificacao").Notificacao;