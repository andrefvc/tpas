var db = require('../models/database.js');
var model = db.InscricaoViagem;

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

function remove(idViagem,idUtilizador, callback) {
    findById(idViagem,idUtilizador, { id: 1 }, function(err, data){
        if (err)
            return callback(err);

        model.remove({ idViagem: idViagem ,idUtilizador:idUtilizador}, function(err, remove) {
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

exports.insert = insert;
exports.update = update;
exports.remove = remove;
exports.find = find;
exports.findAll = findAll;
exports.findById = findById;