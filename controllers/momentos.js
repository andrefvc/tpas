var db = require('../models/database.js');
var model = db.Momento;

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

        //comentarios
        db.Comentario.remove({ idMomento: id }, function(err, remove) {
            console.dir("remove Comentario");
            if (err) console.dir(err);
        });
        //notificações
        db.Notificacao.remove({ idMomento: id }, function(err, remove) {
            console.dir("remove Notificacao");
            if (err) console.dir(err);
        });
        //classificacoes
        db.Classificacao.remove({ idMomento: id }, function(err, remove) {
            console.dir("remove Classificacao");
            if (err) console.dir(err);
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

exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;
exports.findById = findById;

