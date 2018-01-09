var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var tools = require(path.join(__dirname, '/../../../tools'));
var momentoCtrl = require(path.join(__dirname, '/../../../controllers/momentos.js'))

router.get('/viagem/:idViagem', tools.isAuthenticated, function(req, res, next) {
    momentoCtrl.find({idViagem: req.params.idViagem}, { }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));   
    });
});

router.get('/:id', tools.isAuthenticated, function(req, res, next) {
    momentoCtrl.findById(req.params.id, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });
});

router.get('/cidade/:cidade', tools.isAuthenticated, function(req, res, next) {
    momentoCtrl.find({cidade: req.params.cidade}, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });
});

router.put('/:id', tools.isAuthenticated, function(req, res, next) {    
    momentoCtrl.update(req.params.id, req.body, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });  
});

router.delete('/:id', tools.isAuthenticated, function(req, res, next) {    
    momentoCtrl.findById(req.params.id, function(err, momento){
        if (err)
            return res.status(400).jsonp(tools.parseError(err));        

        momentoCtrl.remove(req.params.id, function(err, result) {
            if(err)
                return res.status(400).jsonp(tools.parseError(err));        
            
            tools.imageDelete(momento[0].ficheiros.nome);

            return res.status(200).jsonp(tools.parseData(result)); 
        });
    });  
});


router.post('/', tools.isAuthenticated, function(req, res, next){
    tools.getLocalizacao(req.body.latitude, req.body.longitude, function(err, localiza){
        
        if (err) {
            localiza ={
                country: req.body.pais,
                city: req.body.cidade
            }
        }

        var ficheiros = tools.parseFile(req);

        for (var key in req.body) {
            if (req.body[key].replace){
                req.body[key] = req.body[key].replace('"', '');
                req.body[key] = req.body[key].replace('"', '');
            }
        }

        var momento = {
            "idViagem": req.body.idViagem,
            "popular": req.body.popular,
            "partilhado": false,
            "pais": localiza.country,
            "cidade": localiza.city,
            "latitude": (req.body.latitude === "undefined") ? null: req.body.latitude,
            "longitude": (req.body.longitude === "undefined") ? null: req.body.longitude,
            "dataInicio": req.body.dataInicio,
            "dataFim": req.body.dataFim,
            "descricao": req.body.descricao,
            "narrativa": req.body.narrativa,
            "ficheiros": ficheiros,
            "imagem": ficheiros.nome,
            "class1": 0,
            "class2": 0,
            "class3": 0,
            "sumComentarios": 0
        };
        
        momentoCtrl.insert(momento, function(err, result) {
            if(!err) {
                return res.status(200).jsonp(tools.parseData(result));
            } else {
                return res.status(400).jsonp(tools.parseError(err));
            }
        });  
    }); 
});

module.exports = router;