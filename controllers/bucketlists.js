var db = require('../models/database.js');
var model = db.BucketList;


var addBucketList = function(idUtilizador, viagem){

    var cidade = (viagem.cidade != undefined) ? 'a ' + viagem.cidade : '';
    var pais = (viagem.pais != undefined) ? ", " + viagem.pais : '';

    var bucketlist = {
        idViagem: viagem.id,
        idUtilizador: idUtilizador,
        descricao: "Viagem " + cidade + pais,
        _viagem: viagem._id
    }

    insert(bucketlist, function(err, data){
        if (err){
            console.dir("Erro ao inserir na bucket list");
            console.dir(err);
        }
        else
            console.dir("Inseriu na bucket list");
    });
}

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
    model.find(conditions, projection, callback).populate('_viagem');
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
exports.addBucketList = addBucketList;
