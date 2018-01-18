var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var comentariosCtrl = require(path.join(__dirname, '/../../../controllers/comentarios.js'));
var viagensCtrl = require(path.join(__dirname, '/../../../controllers/viagens.js'));
var momentosCtrl = require(path.join(__dirname, '/../../../controllers/momentos.js'));
var notificacoesCtrl = require(path.join(__dirname, '/../../../controllers/notificacoes.js'));

router.get('/utilizador/:id', tools.isAuthenticated, function(req, res, next) {
    comentariosCtrl.find({ idUtilizador: req.params.id }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/viagem/:id', function(req, res, next) {
    comentariosCtrl.find({ idViagem: req.params.id }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/momento/:id', tools.isAuthenticated, function(req, res, next) {
    comentariosCtrl.find({idMomento: req.params.id }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.delete('/:id', tools.isAuthenticated, function(req, res, next) {

    comentariosCtrl.apagar(req.params.id, function(err, result){
        if(err)
            return res.status(400).jsonp(tools.parseError(err));                

        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.post('/', tools.isAuthenticated, function (req, res) {

    var user = req.user[0] || req.user;

    var comentario = {
        "idMomento": req.body.idMomento,
        "idViagem": req.body.idViagem,
        "idUtilizador": user.id,
        "comentario": req.body.comentario,
        "_user": user._id,
        "dataInsercao": Date.now()
    };
    
    comentariosCtrl.inserir(req, comentario, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));

        return res.status(200).jsonp(tools.parseData(result));
    });
});

module.exports = router;
