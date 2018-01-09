var mongoose = require('mongoose');  
var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');

var schema = new mongoose.Schema({  
    id: {
        type: String,
        unique: true,
        unique: 'Item cannot share the same ID'
    },
    idViagem: {
        type: String        
    },
    idMomento: {
        type: String
    },
    idUtilizador: {
        type: String,
        required: true
    },
    comentario: {
        type: String,
        required: true
    },
    dataInsercao: {
        type: Date,
        required: true,
        default: Date.now()
    },
    _user : { type: String, ref: 'Utilizador' },
    _viagem : { type: String, ref: 'Viagem' },
    _momento : { type: String, ref: 'Momento' },
}, { collection: 'Comentarios' });

schema.plugin(beautifyUnique);

// Saves the user's password hashed (plain text password storage is not good)
schema.pre('save', function (next) { 
  
  if (this.isNew) {
    this.id = uuidV4();
    this.dataInsercao = Date.now();    
  }    

  return next();
});


// create the model for users and expose it to our app
var Comentario = mongoose.model('Comentario', schema);
exports.Comentario = Comentario;