var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var notificacoesCtrl = require(path.join(__dirname, '/../../../controllers/notificacoes.js'));

router.get('/utilizador/:id/naolidas', tools.isAuthenticated, function(req, res, next) {
    notificacoesCtrl.find({ idUtilizador: req.params.id, lida: false }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/utilizador/:id', tools.isAuthenticated, function(req, res, next) {
    notificacoesCtrl.find({ idUtilizador: req.params.id }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.put('/:id', tools.isAuthenticated, function(req, res, next) {
    notificacoesCtrl.update(req.params.id, req.body, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });    
});

router.delete('/:id', tools.isAuthenticated, function(req, res, next) {
    notificacoesCtrl.remove(req.params.id, function(err, result) {
        if(err){
            if (err.message == "Item not found")
                return res.status(404).jsonp(tools.parseData(result, 'Notificação não encontrada'));
            else
                return res.status(400).jsonp(tools.parseError(err));        
        }

        return res.status(200).jsonp(tools.parseData(result)); 
    });    
});


module.exports = router;
