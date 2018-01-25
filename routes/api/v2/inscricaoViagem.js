var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var incricaoViagemCtrl = require(path.join(__dirname, '/../../../controllers/inscricaoViagem.js'));

router.get('/', tools.isAuthenticated, function(req, res, next) {
    incricaoViagemCtrl.findAll({ }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));           
    });
});

router.get('/viagemUser/:idViagem', tools.isAuthenticated, function(req, res, next) {    
    incricaoViagemCtrl.find({idViagem:req.params.idViagem,idUtilizador:req.user[0]._doc.id}, function(err, result){
  
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
    
        return res.status(200).jsonp(tools.parseData(result));   
    });
});

router.get('/viagem/:idViagem/utilizador/:idUtilizador', tools.isAuthenticated, function(req, res, next) {    
    incricaoViagemCtrl.find({idViagem:req.params.idViagem,idUtilizador:req.params.idUtilizador}, function(err, result){
  
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        if(result.length == 0)
        {
            var incricaoViagem = { 
                "idUtilizador": req.params.idUtilizador,
                "idViagem": req.params.idViagem,
                "dataInscricao": new Date()
            };
            incricaoViagemCtrl.insert(incricaoViagem, function(err, result) {
                if(!err) {
                    return res.status(200).jsonp(tools.parseData(result));
                } else {
                    return res.status(400).jsonp(tools.parseError(err));
                }
            }); 
        }
        else{
            incricaoViagemCtrl.remove(result[0]._doc.id, function(err, resultdel) {
                if(err)
                    return res.status(400).jsonp(tools.parseError(err));     
                return res.status(200).jsonp(tools.parseData(resultdel)); 
            });    

        }

    });
});

router.get('/:id', tools.isAuthenticated, function(req, res, next) {
    incricaoViagemCtrl.findById(req.params.id, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });
});

router.get('/viagem/:idViagem', tools.isAuthenticated, function(req, res, next) {
    incricaoViagemCtrl.findById(req.params.idViagem, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });
});

/*
router.post('/', tools.isAuthenticated, function (req, res) {

        var incricaoViagem = { 
            "idUtilizador": req.body.idUtilizador,
            "idViagem": req.body.idViagem,
            "dataInscricao": req.body.dataInscricao
        };
        incricaoViagemCtrl.insert(incricaoViagem, function(err, result) {
            if(!err) {
                return res.status(200).jsonp(tools.parseData(result));
            } else {
                return res.status(400).jsonp(tools.parseError(err));
            }
        });  
});
 
 
router.delete('/viagem/:idViagem/utilizador/:idUtilizador', tools.isAuthenticated, function(req, res, next) {    
    incricaoViagemCtrl.find({idViagem:req.params.idViagem,idUtilizador:req.params.idUtilizador}, function(err, result){
        if (err)
            return res.status(400).jsonp(tools.parseError(err));     

            incricaoViagemCtrl.remove(req.params.id, function(err, result) {
            if(err)
                return res.status(400).jsonp(tools.parseError(err));     
            return res.status(200).jsonp(tools.parseData(result)); 
        });    
    });
});
*/

module.exports = router;