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
    },
    dataInscricao :{
      type:Date,
      require :true
    }

}, 
{ 
  collection: 'InscricaoViagem' 
});

inscricaoViagemSchema.pre('save', function (next) { 
  var inscricaoViagem = this;
    
  if (this.isNew)
    this.id = uuidV4();

  return next();
});



var InscricaoViagem = mongoose.model('InscricaoViagem', inscricaoViagemSchema);
exports.InscricaoViagem = InscricaoViagem;