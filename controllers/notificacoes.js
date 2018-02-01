var db = require('../models/database.js');
var model = db.Notificacao;

var path = require('path');


var addNotificacaoComentarioViagem = function(_idUser, viagem){

    var notificacao = {
        idViagem: viagem.id,
        idMomento: null,
        idUtilizador: viagem.idUtilizador,
        descricao: '',
        tipo: 1,
        _user: _idUser
    }

    var cidade = (viagem.cidade != undefined) ? 'a ' + viagem.cidade : '';
    var pais = (viagem.pais != undefined) ? ', '+ viagem.pais : '';
    notificacao.descricao = ' adicionou um comentário à sua viagem ' + cidade + pais;
    insert(notificacao);
}

var addNotificacaoComentarioMomento = function(_idUser, idUtilizador, momento){

    db.Viagem.find({ id: momento.idViagem }, { idUtilizador:1}, function(err, viagem){
        
        var cidade = (momento.cidade != undefined) ? 'em ' + momento.cidade : '';
        var pais = (momento.pais != undefined) ? ', '+ momento.pais : '';

        var notificacao = {
            idViagem: null,
            idMomento: momento.id,
            idUtilizador: viagem[0].idUtilizador,
            descricao: ' adicionou um comentário à experiência ' + cidade + pais,
            tipo: 1,
            _user: _idUser
        }
                
        insert(notificacao);
    });
}

var addNotificacaoClassificacaoViagem = function(_idUser, viagem){

    var cidade = (viagem.cidade != undefined) ? 'a ' + viagem.cidade : '';
    var pais = (viagem.pais != undefined) ? ', ' + viagem.pais : '';

    var notificacao = {
        idViagem: viagem.id,
        idMomento: null,
        idUtilizador: viagem.idUtilizador,
        descricao: ' classificou a viagem ' + cidade + pais,
        tipo: 2,
        _user: _idUser
    }
    
    insert(notificacao);    
}

var addNotificacaoClassificacaoMomento = function(_idUser, idUtilizador, momento){

    var cidade = (momento.cidade != undefined) ? 'em ' + momento.cidade : '';
    var pais = (momento.pais != undefined) ? ', '+ momento.pais : '';

    var notificacao = {
        idViagem: momento.idViagem,
        idMomento: momento.id,
        idUtilizador: idUtilizador,
        descricao: ' classificou a experiência ' + cidade + pais,
        tipo: 2,
        _user: _idUser
    }

    insert(notificacao);    
}

var addNotificacaoAprovarViagem = function(_idUser, viagem){

    var cidade = (viagem.cidade != undefined) ? ' a ' + viagem.cidade : '';
    var pais = (viagem.pais != undefined) ? ', ' + viagem.pais : '';

    var notificacao = {
        idViagem: viagem.idViagem,
        idMomento: null,
        idUtilizador: viagem.idUtilizador,
        descricao: ' Aprovou a sua viagem' + cidade + pais,
        tipo: 1,
        _user: _idUser
    }

    insert(notificacao);    
}


var addNotificacaoRemoverViagem = function(_idUser, viagem){

    var cidade = (viagem.cidade != undefined) ? ' a ' + viagem.cidade : '';
    var pais = (viagem.pais != undefined) ? ', ' + viagem.pais : '';

    var notificacao = {
        idViagem: viagem.idViagem,
        idMomento: null,
        idUtilizador: viagem.idUtilizador,
        descricao: ' Removeu a sua viagem' + cidade + pais,
        tipo: 1,
        _user: _idUser
    }

    insert(notificacao);    
}



function insert(data, callback) {
    var item = new model(data);
    item.save(function(err, obj) {

        if (callback)
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
    model.find(conditions, projection, callback).populate('_user');
}


function findAll(projection, callback) {
    find(null, projection, callback);
}

exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;
exports.findById = findById;
exports.addNotificacaoComentarioViagem = addNotificacaoComentarioViagem;
exports.addNotificacaoClassificacaoViagem = addNotificacaoClassificacaoViagem;
exports.addNotificacaoComentarioMomento = addNotificacaoComentarioMomento;
exports.addNotificacaoClassificacaoMomento = addNotificacaoClassificacaoMomento;
exports.addNotificacaoAprovarViagem = addNotificacaoAprovarViagem;
exports.addNotificacaoRemoverViagem = addNotificacaoRemoverViagem;