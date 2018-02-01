var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var incricaoViagemCtrl = require(path.join(__dirname, '/../../../controllers/inscricaoViagem.js'));
var viagensCtrl = require(path.join(__dirname, '/../../../controllers/viagens.js'));

router.get('/', tools.isAuthenticated, function(req, res, next) {
    incricaoViagemCtrl.findAll({ }, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));           
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
    incricaoViagemCtrl.find({idViagem:req.params.idViagem}, null, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result));
    });
});


router.get('/viagem/:idViagem/utilizador/:idUtilizador', tools.isAuthenticated, function(req, res, next) {    
    incricaoViagemCtrl.find({idViagem:req.params.idViagem, idUtilizador:req.params.idUtilizador}, function(err, result){
  
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
    
        return res.status(200).jsonp(tools.parseData(result));   
    });
});

router.put('/viagem/:idViagem/utilizador/:idUtilizador', tools.isAuthenticated, function(req, res, next) {    
    incricaoViagemCtrl.find({idViagem:req.params.idViagem,idUtilizador:req.params.idUtilizador}, function(err, result){
  
                 var incricaoViagem = { 
                    "idUtilizador": req.params.idUtilizador,
                    "idViagem": req.params.idViagem,
                    "dataInscricao": new Date()
                };
                
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        if(result.length == 0)
        {

            viagensCtrl.findById(req.params.idViagem,function(err, rviagem) {
                     if(err)
                    return res.status(400).jsonp(tools.parseError(err));        
             

                 incricaoViagemCtrl.find({idViagem:req.params.idViagem}, null, function(err, rincricoes) {
                    if(err)
                        return res.status(400).jsonp(tools.parseError(err));        
                        
                        if(rviagem.length>0)
                        {
                         if(rincricoes.length >= rviagem[0]._doc.maxIncricoes) //getviagem
                         {
                             err = new Error("Número máximo inscritos atingido!!");
                            return res.status(400).jsonp(tools.parseError(err));
                         }
                         
                        }
                   
                     incricaoViagemCtrl.insert(incricaoViagem, function(err, resultPost) {
                            if(!err) {
                                return res.status(200).jsonp(tools.parseData(resultPost));
                            } else {
                                return res.status(400).jsonp(tools.parseError(err));
                            }
                         }); 

                    //return res.status(200).jsonp(tools.parseData(rincricoes));

                 });
                
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

module.exports = router;