var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var viagemSchema = Schema({
    id: {
        type: String,
        unique: true,
        unique: 'Item cannot share the same ID'
    },
    idUtilizador: {
        type: String,
        require: true,
        require: 'Falta id user'
    },
    dataInsercao: { 
      type: Date,
      default: Date.now 
    },
    partilhado:  { 
      type: Boolean,
      default: false 
    },
    popular:  { 
      type: Boolean,
      default: false
    },
    pais: String,
    cidade: String,
    latitude: Number,
    longitude: Number,
    dataInicio: Date,
    dataFim: Date,
    descricao: String,
    ficheiros: { nome: String, data: Buffer, contentType: String },
    sumClass1: Number,
    sumClass2: Number,
    sumClass3: Number,
    sumComentarios: {
      type: Number,
      default: 0
    },
    Classificacao : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classificacao' }],
    buckelists : [{ type: mongoose.Schema.Types.ObjectId, ref: 'BucketLists' }],
    comentarios : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
    _user : { type: String, ref: 'Utilizador' },
    aprovadoEm: Date,
    aprovadoPor: String,
    aprovado:{type:Boolean, default:0} ,

}, 
{ 
  collection: 'Viagens' 
});

viagemSchema.pre('save', function (next) { 
  var viagem = this;
    
  if (this.isNew)
    this.id = uuidV4();

  return next();
});


var Viagem = mongoose.model('Viagem', viagemSchema);
exports.Viagem = Viagem;