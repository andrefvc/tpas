var mongoose = require('mongoose');  
var bcrypt = require('bcrypt-nodejs');
var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');

var schema = new mongoose.Schema({  
    id: {
        type: String,
        unique: true,
        unique: 'Item cannot share the same ID'
    },
    idViagem: {
        type: String,
        required: true
    },
    idMomento: {
        type: String
    },
    idUtilizador: {
        type: String,
        required: true
    },
    classificacao: {
        type: Number,
        required: true,
        enum: [1,2,3]
    },
    _viagem : { type: String, ref: 'Viagem' },
}, { collection: 'Classificacoes' });

schema.plugin(beautifyUnique);

// Saves the user's password hashed (plain text password storage is not good)
schema.pre('save', function (next) { 
  var user = this;

  if (this.isNew)
    this.id = uuidV4();

  return next();
});

// create the model for users and expose it to our app
var Classificacao = mongoose.model('Classificacao', schema);
exports.Classificacao = Classificacao;