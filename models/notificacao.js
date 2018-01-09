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
    dataInsercao: {
        type: Date,
        required: true,
        default: Date.now()
    },
    descricao: String,
    tipo: {
        type: Number,
        required: true,
        enum: [1,2]   //1: viagem //2: momentos
    },
    lida:{
        type: Boolean,
        default: false
    },
    _user : { type: String, ref: 'Utilizador' },
}, { collection: 'Notificacoes' });

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
var Notificacao = mongoose.model('Notificacao', schema);
exports.Notificacao = Notificacao;