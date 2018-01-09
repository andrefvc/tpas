var mongoose = require('mongoose');  
var bcrypt = require('bcrypt-nodejs');
var uuidV4 = require('uuid/v4');
let beautifyUnique = require('mongoose-beautiful-unique-validation');

var UserSchema = new mongoose.Schema({  
  id: {
    type: String,
    unique: true,
    unique: 'Item cannot share the same ID'
  },
  nome: {
    type: String,
    required: true,
    required: 'Nome obrigatório'
  },
  email: {
    type: String,
    lowercase: true,    
    required: true,
    required: 'Email obrigatório',
    unique: true,
    unique: 'Já existe um utilizador com este email'
  },
  foto: String,
  password: {
    type: String,
    required: true,
    required: 'Password obrigatória'
  },
  facebook:{
    id: String,
    token: String,
  },
  creditos :{
    type: Number,
    default: 0
  },
  comentarios :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comentario' }],
  notificacoes : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notificacao' }],
  viagens : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Viagem' }]
}, { collection: 'Utilizadores' });

UserSchema.plugin(beautifyUnique);

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) { 
  var user = this;

  if (this.isNew)
    this.id = uuidV4();

  if (this.isNew && user.password != undefined) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null); 
  }
  
  return next();
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
var User = mongoose.model('Utilizador', UserSchema);
exports.User = User;