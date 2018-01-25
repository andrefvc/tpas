var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var viagensCtrl = require(path.join(__dirname, '/../../../controllers/viagens.js'));

router.get('/',   function(req, res, next) {
    var query = {};

    if (req.query.query) {

        if (req.query.query == 'publicas'){
            query = { 
                partilhado: true
            }
        }
        else {
            if (req.user == undefined){
                var err = tools.parseError(new Error("Utilizador não autenticado!"));
                err.ErrorCode = 401;
                return res.status(401).jsonp(err);
            }
            
            var user = req.user[0] || req.user;

            if (req.query.query == 'minhas'){
                query = { idUtilizador: user.id };
            }
            else if (req.query.query == 'partilhadas'){
                query = { 
                    $and : [
                        { partilhado: true },
                        { idUtilizador: { "$ne": user.id } }
                    ]
                };
            }
            else if (req.query.query == 'todas'){
                query = { 
                    $or : [
                        { $and : [
                            { partilhado: true },
                            { idUtilizador: { "$ne": user.id } }
                        ] },
                        { idUtilizador: user.id }
                    ]
                }
            }
        }
    }
    else if (req.query.filtro){
        query = { 
            $or : [
                { pais: new RegExp('\.*'+req.query.filtro+'\.*', 'i') },
                { cidade: new RegExp('\.*'+req.query.filtro+'\.*', 'i') },
                { descricao: new RegExp('\.*'+req.query.filtro+'\.*', 'i') }
            ]
        }
    }
    else
        query = req.query;

    viagensCtrl.find(query, { }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));           
    });
});

router.get('/:id', tools.isAuthenticated, function(req, res, next) {
    viagensCtrl.findById(req.params.id, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));        
    });
});

router.get('/utilizador/:idUtilizador', tools.isAuthenticated, function(req, res, next) {
    viagensCtrl.find({idUtilizador: req.params.idUtilizador}, { }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/cidade/:cidade', tools.isAuthenticated, function(req, res, next) {
    viagensCtrl.find({cidade: req.params.cidade}, { }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.put('/:id', tools.isAuthenticated, function(req, res, next) {

    var viagem = { };

    if (req.body.aprovado)
    viagem.aprovado = req.body.aprovado;
    if (req.body.aprovadoPor)
    viagem.aprovadoPor = req.body.aprovadoPor;
    if (req.body.aprovadoEm)
        viagem.aprovadoEm = req.body.aprovadoEm;
    if (req.body.popular)
        viagem.popular = req.body.popular;
    if (req.body.partilhado)
        viagem.partilhado = req.body.partilhado;
    if (req.body.dataInicio)
        viagem.dataInicio = req.body.dataInicio;
    if (req.body.descricao)
        viagem.descricao = req.body.descricao;
    if (req.body.pais)
        viagem.pais = req.body.pais;
    if (req.body.cidade)
        viagem.cidade = req.body.cidade;
        
    viagensCtrl.update(req.params.id, viagem, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });  
});

router.delete('/:id', tools.isAuthenticated, function(req, res, next) {    
    viagensCtrl.findById(req.params.id, function(err, viagem){
        if (err)
            return res.status(400).jsonp(tools.parseError(err));     

        viagensCtrl.remove(req.params.id, function(err, result) {
            if(err)
                return res.status(400).jsonp(tools.parseError(err));     
            
            tools.imageDelete(viagem[0].ficheiros.nome);

            return res.status(200).jsonp(tools.parseData(result)); 
        });    
    });
});

router.post('/', tools.isAuthenticated, function (req, res) {
    tools.getLocalizacao(req.body.latitude, req.body.longitude, function(err, localiza){
        
        var user = req.user[0] || req.user;
        
        if (err) {
            localiza ={
                country: req.body.pais,
                city: req.body.cidade
            }
        }

        var viagem = {
            "idUtilizador": req.body.idUtilizador,
            "popular": false,
            "partilhado": req.body.partilhado,
            "pais": localiza.country,
            "cidade": localiza.city,
            "latitude": (req.body.latitude === "undefined") ? null: req.body.latitude,
            "longitude": (req.body.longitude === "undefined") ? null: req.body.longitude,
            "dataInicio": req.body.dataInicio,
            "dataFim": req.body.dataFim,
            "descricao": req.body.descricao,
            "ficheiros": tools.parseFile(req),
            "_user": user._id,
            "sumClass1": 0,
            "sumClass2": 0,
            "sumClass3": 0,
            "aprovadoEm":req.body.aprovadoEm,
            "aprovadoPor":req.body.aprovadoPor,
            "aprovado":req.body.aprovado
        };

        if(user._doc.perfil > 0)
        {
            viagem.partilhado = true;
        }
        
        viagensCtrl.insert(viagem, function(err, result) {
            if(!err) {
                return res.status(200).jsonp(tools.parseData(result));
            } else {
                return res.status(400).jsonp(tools.parseError(err));
            }
        });  
    }); 
});


router.get('/utilizador/:perfil', tools.isAuthenticated, function(req, res, next) {
    viagensCtrl.find({perfil: req.params.idUtilizador}, { }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

module.exports = router;