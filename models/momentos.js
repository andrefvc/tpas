var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var momentoSchema = Schema({
    id: {
        type: String,
        unique: true,
        unique: 'Item cannot share the same ID'
    },
    idViagem: {
        type: String,
        required: true
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
    narrativa: String,
    ficheiros: { 
      nome: String, 
      data: Buffer, 
      contentType: String 
    },
    imagem: String,
    class1: Number,
    class2: Number,
    class3: Number,
    _user : { type: String, ref: 'Utilizador' },
    sumComentarios: {
      type: Number,
      default: 0
    },
    comentarios : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
}, { collection: 'Momentos' });

momentoSchema.plugin(beautifyUnique);

momentoSchema.pre('save', function (next) { 
  var user = this;
    
  if (this.isNew)
    this.id = uuidV4();

  return next();
});

var Momento = mongoose.model('Momento', momentoSchema);
exports.Momento = Momento;
