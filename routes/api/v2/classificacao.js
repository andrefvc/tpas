var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var classificacoesCtrl = require(path.join(__dirname, '/../../../controllers/classificacoes.js'))


router.get('/momento/:id', tools.isAuthenticated, function(req, res, next) {
    classificacoesCtrl.find({ idMomento: req.params.id }, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/viagem/:id', tools.isAuthenticated, function(req, res, next) {
    classificacoesCtrl.find({ idViagem: req.params.id }, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.post('/', tools.isAuthenticated, function(req, res, next) {    
    classificacoesCtrl.classifica(req, function(err, result){        
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));      
    });
});

module.exports = router;