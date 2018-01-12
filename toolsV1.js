var fs = require('fs');
const uuidV4 = require('uuid/v4');
var fileType = require('file-type');
// --------------------------------------------------- API v1.0 ---------------------------------------------//

var responseJSON = function(message=''){
  if(message == '')
    message = 'Ok';


  this.ErrorCode = 200;
  this.Error = { };
  this.Message = message;
  this.Data = { };
}
exports.responseJSON = responseJSON;
var sheckFile = function(path, id){
   var exists = false;
   try {
      stats = fs.statSync('./data/' + path + '/' + id + '.json');
      console.log("File exists.");
      exists = true;
   }
   catch (e) {
      console.log("File does not exist.");
      exists = false;
   }
   return exists;
}

var writeFile = function (path, id, data, callback, insert = true){
   var json = new exports.responseJSON();
   
   //mandatory fields
   var mandatory = [];
   if (!id)
      mandatory.push({'id': id});

   if (mandatory.length > 0){
      json.ErrorCode = 500;
      json.Message = "Campos Obrigatorios em falta";
      json.Data = mandatory;
      
      if (!callback){
            json.Message += '\r\n   --> callback is not defined';
        }
      callback(json);
      return;
   }
   // check file
   if (insert) {
      var exists = sheckFile(path, id);
      if (exists){
          json.ErrorCode = 500;
          json.Message = "Já existe um ficheiro com este ID";

          if (!callback){
                json.Message += '\r\n   --> callback is not defined';
            }
          callback(json);
          return;
      }
   }
   
  fs.writeFile('./data/' + path + '/' + id + '.json', JSON.stringify(data), function(err) {
      if(err) {
        json.ErrorCode = 500;
        json.Erro = err;
        json.Message = 'Ocorreu um erro ao gravar os dados'
        if (err.errno == -4058)
          json.Message = 'Não foi encontrado o caminho para os dados'        
      } else
        json.Message = 'Gravado com sucesso';


        if (!callback){
            json.Message += '\r\n   --> callback is not defined';
        }
        callback(json);
    });
}

var readFile = function (path, id, callback) {
  fs.readFile('./data/' + path + '/' + id + '.json', function (err, data) {
    var json = new exports.responseJSON();
        if (err) {
            if (err.errno == -4058)
               json.Message = "Ficheiro não encontrado!";
            json.ErrorCode = 500;
            json.Error = err;
        } else {
          json.Data = JSON.parse(data);
        }

        if (!callback){
            json.Message += '\r\n   --> callback is not defined';
        }
        callback(json);
    });
}

var readFileSync = function (path, id, callback){
   var json = new exports.responseJSON();
   try {
      json.Data = JSON.parse(fs.readFileSync('./data/' + path + '/' + id + '.json'));
   } catch (error) {
      json.ErrorCode = 500;
      json.Error = err;
   }
      if (!callback){
         json.Message += '\r\n   --> callback is not defined';
      }
      callback(json);
}


var readFilesByCidade = function (path, idViagem, callback){

    readFiles(path, function(json){
      var data = [];
      json.Data.forEach(function(file){
        if (file.idViagem == idViagem){          
          data.push(JSON.parse(fs.readFileSync('./data/' + path + '/' + file.id + '.json')));          
        }          
      });
      json.Data = data;

      callback(json);
    });
}

var readFiles = function (path, callback){

  fs.readdir('./data/' + path + '/', function(err, files) {
    var json = new exports.responseJSON();
      var fileNames = [];

      if (err){
        json.ErrorCode = 500;
        json.Error = err;
        json.Message = "Erro ao ler ficheiros";

        if (!callback){
            json.Message += '\r\n   --> callback is not defined';
        }
        callback(json);
        return;
      }
    console.dir(files);
      files.forEach(file => {
        if (file.indexOf('.json') > -1 && file.replace('.json','').length > 0)
          fileNames.push(file.replace('.json',''));
      });

      json.Data = [];
      fileNames.forEach(function(file){
        json.Data.push(JSON.parse(fs.readFileSync('./data/' + path + '/' + file + '.json')));
      });
      
      if (!callback){
          json.Message += '\r\n   --> callback is not defined';
      }
      callback(json);
    });
}

var fileDelete = function (path, id, callback){
  var filePath = './data/' + path + '/'+id+'.json'; 
  
  var json = new exports.responseJSON('Removido com sucesso!');
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    json.ErrorCode = 500;
    json.Error = error;
    json.Message = 'Erro ao remover ficheiro';
  }

  if (!callback){
      json.Message += '\r\n   --> callback is not defined';
   }
  callback(json);
};

var deleteAll = function (path, callback){

  var filePath = './data/' + path + '/'; 

  var json = new exports.responseJSON('Removido com sucesso!');
  try {
var fileNames = [];
    var files = fs.readdirSync(filePath);
    
    files.forEach(file => {
        if (file.indexOf('.json') > -1)
          fileNames.push(file);
      });
    console.dir(fileNames);
    fileNames.forEach(function(item){
        fs.unlinkSync(filePath + item);        
    });
  } catch (error) {
    json.ErrorCode = 500;
    json.Error = error;
    json.Message = 'Erro ao remover ficheirossss';
  }

  if (!callback){
      json.Message += '\r\n   --> callback is not defined';
   }
  callback(json);
};


var fileUpload = function (path, filename, buffer, callback){

  var filePath = './data/' + path + '/' + filename; 

  fs.writeFile(filePath, buffer,  "binary",function(err) {
      var json = new exports.responseJSON();
      if(err) {
        json.ErrorCode = 500;
        json.Error = err;
        json.Message = 'Ocorreu um erro no upload do ficheiro'
      } else
        json.Message = 'Upload com sucesso';

        if (!callback){
            json.Message += '\r\n   --> callback is not defined';
        }
        callback(json);
  });
}

var guid = function guid() {
  return uuidV4();
}

exports.guid = guid;
exports.writeFile = writeFile;
exports.readFile = readFile;
exports.readFiles = readFiles;
exports.readFilesByCidade = readFilesByCidade;
exports.fileDelete = fileDelete;
exports.sheckFile = sheckFile;
exports.fileUpload = fileUpload;
exports.deleteAll = deleteAll;