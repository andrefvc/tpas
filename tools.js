//andre
var fs = require('fs');
const uuidV4 = require('uuid/v4');
var fileType = require('file-type');
var where = require('where');
var Forecast = require('forecast');
var NodeGeocoder = require('node-geocoder');

var responseJSON = function(message=''){
  if(message == '')
    message = 'Ok';

  this.ErrorCode = 200;
  this.Error = { };
  this.Message = message;
  this.Data = { };
}

exports.responseJSON = responseJSON;

var parseError = function(err, data){
  var json = new responseJSON();  
  if (err.name === 'ValidationError'){
      for (var key in err.errors) {
        json.Message = err.errors[key].message;
      }
      json.ErrorCode = 'ValidatorError';
      json.Error = err.errors;
      json.Data = data;
  }
  else{
      json.ErrorCode = 400;
      json.Message = err.message;
      json.Error = err.stack;
      json.Data = data;
  }
  return json;
}
exports.parseError = parseError;

exports.parseData = function(data, message){
  var json = new responseJSON();
    json.Message = (message == undefined ? 'Ok' : message);
    json.Data = data;

  return json;
}

exports.parseFile = function(req){
    var data;
    var ficheiros = {
        nome: 'viagem.jpg',
        data: null,
        contentType: null
    };

   if (req.body.ficheiros != null && req.body.ficheiros !== "undefined"){
        console.dir("file in body");
        data = req.body.ficheiros;
        
        var buffer = new Buffer(data.length);
        for (var i = 0; i < data.length; i++) {
            buffer[i] = data[i];
        } 
        
        var objType = fileType(buffer);

        ficheiros = {
            nome: guid() + "." + objType.ext,
            data: buffer,
            contentType: objType.mime
        };

        var filePath = './data/' + ficheiros.nome; 

        fs.writeFile(filePath, ficheiros.data,  "binary",function(err) {
            console.dir('upload com sucess: ' + ficheiros.nome);
        });
    }
    else if (req.files && req.files.ficheiros){
        console.dir("file in files");
        data = req.files.ficheiros.data;

        ficheiros = {
            nome: guid() + req.files.ficheiros.name.substring(req.files.ficheiros.name.lastIndexOf('.'),req.files.ficheiros.name.length),
            data: data,
            contentType: req.files.ficheiros.mimetype
        };

        var filePath = './data/' + ficheiros.nome; 

        fs.writeFile(filePath, ficheiros.data,  "binary",function(err) {
            console.dir('upload com sucess: ' + ficheiros.nome);
        });
    }

    // nao interessa gravar em BD o buffer
    // a imagem e' lida a partir do nome apenas com a rota 
    ficheiros.data = null;
    
    return ficheiros;
}

var imageDelete = function (name){
    var filePath = './data/' + name;

    try {
        fs.unlinkSync(filePath);
        console.dir('imagem removida');
    } catch (error) {
        console.dir(error);
        console.dir('erro a remover imagem');
    }
};
exports.imageDelete = imageDelete;

var getLocalizacao = function(lat, lng, callback){

    var geocoder = NodeGeocoder();
    geocoder.reverse({lat:lat, lon:lng})
        .then(function(res) {
          callback(null, {city: res[0].city, country: res[0].country});            
        })
        .catch(function(err) {
            callback(err);
        });
}
exports.getLocalizacao = getLocalizacao;

var getCoordinates = function(city, country, callback){

    var geocoder = NodeGeocoder();
    geocoder.geocode(city + ', ' + country)
        .then(function(res) {
          callback(null, {latitude: res[0].latitude, longitude: res[0].longitude} );            
        })
        .catch(function(err) {
            callback(err);
        });
}
exports.getCoordinates = getCoordinates;

var getTemperatureAt = function(cityName, countryCode, callback) {
    getCoordinates(cityName, countryCode, function(err, res) {
        if(!err) {
            getTemperatureAtCoords(res.latitude, res.longitude, function(err, res) {
                callback(err, res);
            })
        } else {
          callback(err, null);
        }
    });
}
exports.getTemperatureAt = getTemperatureAt;

var getTemperatureAtCoords = function(lat, lon, callback) {
    var forecast = new Forecast({
        service: 'forecast.io',
        key: 'ca62ab0a9d8042f6f144ee3af0cc43f0',
        units: 'celcius',
        cache: true,
        ttl: {
            minutes: 27,
            seconds: 45
        }
    });

    forecast.get([lat, lon], function(err, weather) {
        if (!weather)
            callback(new Error('Erro a obter metereologia'));
        else
            callback(err, weather.daily.data);
    });
}
exports.getTemperatureAtCoords = getTemperatureAtCoords;

var passport = require('passport');
var auth = require('basic-auth');

var isAuthenticated = function(req, res, next){

    var authdata = auth(req);

    if (authdata){
        req.body.email_user= authdata.name;
        req.body.id_user = authdata.pass;
    }
    

    if (authdata && req._passport.session){
        if (req._passport.session.user == authdata.pass) {
            return next();
        }
        else{
            var err = parseError(new Error("Utilizador não autenticado!"));
            err.ErrorCode = 401;
            return res.status(401).jsonp(err);
        }
    }

    var authenticator = req._passport.instance.authenticate ('id');
    authenticator (req, res, function(err, user){
        if (err) {
            var err = parseError(new Error("Utilizador não autenticado!"));
            err.ErrorCode = 401;
            return res.status(401).jsonp(err);
        }
        next();
    });
}

var guid = function guid() {
  return uuidV4();
}
exports.guid = guid;

exports.isAuthenticated = isAuthenticated;