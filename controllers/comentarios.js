var db = require('../models/database.js');
var model = db.Comentario;
var path = require('path');

var viagensCtrl = require(path.join(__dirname, '../controllers/viagens.js'));
var momentosCtrl = require(path.join(__dirname, '../controllers/momentos.js'));
var notificacoesCtrl = require(path.join(__dirname, '../controllers/notificacoes.js'));

function insert(data, callback) {
    var item = new model(data);
    item.save(function(err, obj) {
        callback(err, obj);
    });
}

function update(id, data, callback) {        
    model.findOneAndUpdate({id:id}, data, function (err, place) {
        callback(err, place);
    });
}

function remove(id, callback) {
    findById(id, { id: 1 }, function(err, data){
        if (err)
            return callback(err);

        model.remove({ id: id }, function(err, remove) {
            if (remove.result.n == 0) {            
                err = new Error("Item not found");  
                err.Error = remove;       
                return callback(err);
            }

            callback(err,remove);
        });
    });
}

function findById(id, projection, callback) {
    find({'id': id}, projection, callback);
}

function find(conditions, projection, callback) {
    model.find(conditions, projection, callback).populate('_user').populate('_viagem').populate('_momento');
}


function findAll(projection, callback) {
    find(null, projection, callback);
}



function apagar(idComentario, callback){
    findById(idComentario,{ idViagem: 1, idMomento:1}, function(err, coment){
        if(err)
            return callback(err);

        remove(idComentario, function(err, result) {
            if(err)
                return callback(err);

            if (coment[0].idMomento){
                momentosCtrl.findById(coment[0].idMomento, { sumComentarios: 1 }, function(err, momento){
                    if(err)
                        return callback(err);

                    momento[0].sumComentarios += 1;

                        momentosCtrl.update(coment[0].idMomento, momento[0], function(err, update){
                        if(err)
                            return callback(err);

                        return callback(err, coment[0]);
                        });
                });
            }
            else {
                viagensCtrl.findById(coment[0].idViagem, { sumComentarios:1 }, function(err, viagem){
                    if(err)
                        return callback(err);
                    
                    viagem[0].sumComentarios -= 1;
                    
                    viagensCtrl.update(coment[0].idViagem, viagem[0], function(err, update){
                        if(err)
                            return callback(err);
                        
                        callback(err, update);
                    });
                }); 
            }
        });   
    });   
}

function inserir(req, comentario, callback){
    insert(comentario, function(err, result) {

        var user = req.user[0] || req.user;

        if(err)
            return callback(err);

        if (comentario.idMomento){
            momentosCtrl.findById(comentario.idMomento, { sumComentarios:1, cidade:1, pais:1, _user:1, idUtilizador:1 }, function(err, momento){
                if(err)
                    return callback(err);

                // atualizar o _viagem
                update(result.id, { _momento: momento[0]._id }, function(){});

                momento[0].sumComentarios += 1;

                momentosCtrl.update(comentario.idMomento, momento[0], function(err, update){
                    if(err)
                        return callback(err);
                    
                    notificacoesCtrl.addNotificacaoComentarioMomento(user._id, comentario.idUtilizador,  update);

                    return callback(null, result);
                });
            });
        }
        else {
            viagensCtrl.findById(req.body.idViagem, { sumComentarios:1, cidade:1, pais:1, _user:1, idUtilizador:1 }, function(err, viagem){
                if(err)
                    return callback(err);
                
                // atualizar o _viagem
                update(result.id, { _viagem: viagem[0]._id }, function(){});

                viagem[0].sumComentarios += 1;
                
                viagensCtrl.update(req.body.idViagem, viagem[0], function(err, update){
                    if(err)
                        return callback(err);
                    
                    notificacoesCtrl.addNotificacaoComentarioViagem(user._id, viagem[0]);
                    
                    return callback(null, result);                
                });
            });
        }        
    }); 
}


exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;
exports.findById = findById;

exports.apagar = apagar;
exports.inserir = inserir;
