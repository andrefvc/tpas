var Enumerable = require('linq');
var db = require('../models/database.js');
var viagemModel = db.Viagem;

var viagensCtrl = require('../controllers/viagens.js');
var utilizadoresCtrl = require('../controllers/utilizadores.js');
var inscricoesCtrl = require('../controllers/inscricaoviagem.js');

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}



function getViagensGroupByPais(callback) {      
        
    var viagensDTO = [];
    
    // contar todos os users
    utilizadoresCtrl.findAll({ id: 1 }, function (err, users) {
        if (err)
            callback(err);

        //obter todas as viagens
        viagensCtrl.findAll({ }, function (err, viagens) {
            if (err)
                callback(err);

            // contar todos os users inscritos para cada viagem
            inscricoesCtrl.findAll({ idViagem: 1 }, function (err, usersInscritos) {
                if (err)
                    callback(err);
            
                viagens.forEach(viagem => {

                    //users inscritos para cada viagem
                    var inscritos = Enumerable.from(usersInscritos).where(function(x){ 
                        return x.idViagem == viagem._doc.id 
                    })

                    viagensDTO.push({
                        pais: viagem._doc.pais,
                        cidade: viagem._doc.cidade,
                        data: viagem._doc.dataInicio,
                        imagem: viagem._doc.ficheiros.nome,
                        ocupacao: ((inscritos.count() / users.length) * 100),
                        classificacoes: viagem._doc.sumClass1 + viagem._doc.sumClass2 + viagem._doc.sumClass3,
                        comentarios: viagem._doc.sumComentarios,
                        visualizacoes: viagem._doc.visualizacoes,                
                        partilhado: viagem._doc.partilhado,      
                        aprovado: viagem._doc.aprovado          
                    });
                });

                var viagensByPais = Enumerable
                .from(viagensDTO)
                .groupBy(function(x){ 
                    return x.pais; 
                })
                .select(function(x){
                    return {
                        pais: x.key(),
                        ocupacao: x.sum(function(y){ return y.ocupacao; }).toFixed(0),
                        classificacoes: x.sum(function(y){ return y.classificacoes|0; }),
                        comentarios: x.sum(function(y){ return y.comentarios|0; }),
                        visualizacoes: x.sum(function(y){ return y.visualizacoes|0; })                 
                    };
                })
                .toArray();

                callback(err, viagensByPais);
            });
        });        
    });
}


function getViagensByPais(data, callback) {      
        
    var viagensDTO = [];
    
    // contar todos os users
    utilizadoresCtrl.findAll({ id: 1 }, function (err, users) {
        if (err)
            callback(err);

        //obter todas as viagens
        viagensCtrl.find({ pais: data }, { }, function (err, viagens) {
            if (err)
                callback(err);

            // contar todos os users inscritos para cada viagem
            inscricoesCtrl.findAll({ idViagem: 1 }, function (err, usersInscritos) {
                if (err)
                    callback(err);
            
                viagens.forEach(viagem => {

                    //users inscritos para cada viagem
                    var inscritos = Enumerable.from(usersInscritos).where(function(x){ 
                        return x.idViagem == viagem._doc.id 
                    })

                    viagensDTO.push({
                        pais: viagem._doc.pais,
                        cidade: viagem._doc.cidade,
                        data: viagem._doc.dataInicio,
                        imagem: viagem._doc.ficheiros.nome,
                        ocupacao: ((inscritos.count() / users.length) * 100),
                        classificacoes: viagem._doc.sumClass1 + viagem._doc.sumClass2 + viagem._doc.sumClass3,
                        comentarios: viagem._doc.sumComentarios,
                        visualizacoes: viagem._doc.visualizacoes,                
                        partilhado: viagem._doc.partilhado,      
                        aprovado: viagem._doc.aprovado          
                    });
                });

                callback(err, viagensDTO);
            });
        });        
    });
}


function getVisitas(callback) {      

    //obter todas as viagens
    viagensCtrl.findAll({ dataInicio: 1, visualizacoes:1 }, function (err, viagens) {
        if (err)
            callback(err);

        var viagensGrouped = Enumerable
            .from(viagens)
            .groupBy(function(x){ 
                if (x._doc.dataInicio)
                    return x._doc.dataInicio.getFullYear() + '-'+ (x._doc.dataInicio.getMonth()+1) + '-' + x._doc.dataInicio.getDate(); 
                else
                return "";
            })
            .select(function(x){
                return {
                    visualizacoes: x.sum(function(y){ return y.visualizacoes|0; })                 
                };
            })
            .toArray();

        callback(err, viagensGrouped);
    });
}

exports.getViagensGroupByPais = getViagensGroupByPais;
exports.getViagensByPais = getViagensByPais;
exports.getVisitas = getVisitas;