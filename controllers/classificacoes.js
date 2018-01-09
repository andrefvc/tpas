var db = require('../models/database.js');
var model = db.Classificacao;
var uuidV4 = require('uuid/v4');
var path = require('path');
var viagensCtrl = require(path.join(__dirname, '/../controllers/viagens.js'));
var momentoCtrl = require(path.join(__dirname, '/../controllers/momentos.js'));
var bucketListCtrl = require(path.join(__dirname, '/../controllers/bucketlists.js'));
var notificacoesCtrl = require(path.join(__dirname, '/../controllers/notificacoes.js'));

function insert(data, callback) {

    var classificacao = {
        "idViagem": data.idViagem,
        "idMomento": data.idMomento,
        "idUtilizador": data.idUtilizador,
        "classificacao": data.classificacao,
        "_viagem": data._viagem
    };
    var item = new model(classificacao);
    item.save(function(err, obj) {
        callback(err, obj);
    });
};

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
    model.find(conditions, projection, callback);
}

function findAll(projection, callback) {
    find(null, projection, callback);
}

function classifica(req, callback){

    var user = req.user[0] || req.user;
    
    var classifica = req.body.classifica;
    var idUtilizador = req.body.idUtilizador;
    var idViagem = req.body.idViagem;
    var idMomento = req.body.idMomento;

    var item = {};
    var queryFind ={};

    classifica = parseInt(classifica);

    if (classifica == 1)
        item = { id: uuidV4(),
                 idViagem: idViagem,  
                 idMomento: idMomento,
                 idUtilizador: idUtilizador, 
                 classificacao: classifica
               };
    if (classifica == 2)
        item = { id: uuidV4(),
                 idViagem: idViagem, 
                 idMomento: idMomento,
                 idUtilizador: idUtilizador, 
                 classificacao: classifica
               };
    if (classifica == 3)
        item = { id: uuidV4(),
                 idViagem: idViagem,  
                 idMomento: idMomento,
                 idUtilizador: idUtilizador, 
                 classificacao: classifica
               };

    if (!idMomento)
        queryFind = {idUtilizador: idUtilizador, idViagem: idViagem };
    else
        queryFind = {idUtilizador: idUtilizador, idMomento: idMomento };
                
    model.update(queryFind, item, { upsert: true }, function(err, call) {
        if (err)
            return callback(err);

        if (!call.upserted)
            return callback(new Error( 'Este momemto ja foi classificado'));
        
        viagensCtrl.findById(idViagem, function(err, viagem){

            var viagem = viagem[0];

            if (classifica == 1)
                viagem.sumClass1 += 1;
            if (classifica == 2)
                viagem.sumClass2 += 1;
            if (classifica == 3)
                viagem.sumClass3 += 1;
            
            viagensCtrl.update(idViagem, viagem, function(err, data){
                if (err)
                    return callback(err);
                

                // atualiza o _viagem
                update(item.id, { _viagem: viagem._id }, function(){});

                if(!idMomento){
                    notificacoesCtrl.addNotificacaoClassificacaoViagem(user._id, viagem);
                    if (classifica == 3)
                        bucketListCtrl.addBucketList(idUtilizador, viagem);

                        return callback(null, call);
                }
                else{
                    momentoCtrl.findById(idMomento, function(err, momento){
                        if (err)
                            return callback(err);
                        
                        var momento = momento[0];

                        if (classifica == 1)
                            momento.class1 += 1;
                        if (classifica == 2)
                            momento.class2 += 1;
                        if (classifica == 3)
                            momento.class3 += 1;            
                        
                        momentoCtrl.update(idMomento, momento, function(err, data){
                            if (err)
                                return callback(err);

                            if (classifica == 3)
                                bucketListCtrl.addBucketList(idUtilizador, viagem);

                            notificacoesCtrl.addNotificacaoClassificacaoMomento(user._id, viagem.idUtilizador, momento);
                            
                            callback(null, classifica);
                        });
                    });
                }
            });
        });
    });
};

exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;
exports.findById = findById;

exports.classifica = classifica;
