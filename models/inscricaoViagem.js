var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inscricaoViagemSchema = Schema({
  
    idUtilizador: {
        type: String,
        require: true,
        require: 'Falta id user'
    },
    idViagem: { 
       type: String,
        require: true,
        require: 'Falta id viagem'
    }
}, 
{ 
  collection: 'inscricaoViagem' 
});



var inscricaoViagem = mongoose.model('inscricaoViagem', inscricaoViagemSchema);
exports.inscricaoViagem = inscricaoViagem;