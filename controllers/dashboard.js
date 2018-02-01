var Enumerable = require('linq');
var db = require('../models/database.js');
var viagemModel = db.Viagem;

var viagensCtrl = require('../controllers/viagens.js');
var utilizadoresCtrl = require('../controllers/utilizadores.js');
var inscricoesCtrl = require('../controllers/inscricaoviagem.js');

/// obtem toas as viagens agrupadas por pais
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

                    //array apenas com o que importa
                    viagensDTO.push({
                        pais: viagem._doc.pais,
                        ocupacao: ((inscritos.count() / users.length) * 100),
                        classificacoes: viagem._doc.sumClass1 + viagem._doc.sumClass2 + viagem._doc.sumClass3,
                        comentarios: viagem._doc.sumComentarios,
                        visualizacoes: viagem._doc.visualizacoes,     
                    });
                });

                //viagens agrupadas por pais
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

                //visualizações agrupadas por dia
                var visualizacoesByDay = Enumerable
                    .from(viagens)
                    .groupBy(function(x){
                        return x._doc.dataInsercao.getDate() + '-'+ ('00' + (x._doc.dataInsercao.getMonth()+1)).slice(-2) + '-' + x._doc.dataInsercao.getFullYear(); 
                    })
                    .select(function(x){
                        return {
                            data: x.key(),
                            visualizacoes: x.sum(function(y){ return y.visualizacoes|0; })                 
                        };
                    })
                    .toArray();

                //percentagem de escursoes
                //viagens agrupadas por pais
                var escursoes = Enumerable
                    .from(usersInscritos)
                    .groupBy(function(x){ 
                        return x.idViagem; 
                    })
                    .select(function(x){
                        return {
                            idViagem: x.key(),
                            count: x.count(function(y){ return y.idViagem; })
                        };
                    })
                    .toArray();

                var result = {
                    taxaInscritos: ((usersInscritos.length / users.length) * 100).toFixed(2),
                    taxaEscursoes: ((escursoes.length / viagens.length) * 100).toFixed(2),
                    Numviagens: viagens.length,
                    NumUtilizadores: users.length,
                    viagensByPais: viagensByPais,
                    visualizacoesByDay: visualizacoesByDay,                    
                };

                callback(err, result);
            });
        });        
    });
}

// obtem todas as viagens de um pais
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

exports.getViagensGroupByPais = getViagensGroupByPais;
exports.getViagensByPais = getViagensByPais;