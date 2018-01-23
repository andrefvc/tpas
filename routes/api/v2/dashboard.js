var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var dashboardCtrl = require(path.join(__dirname, '/../../../controllers/dashboard.js'));

router.get('/viagens', function(req, res, next) {
    dashboardCtrl.getViagensGroupByPais(function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/viagens/pais/:pais', function(req, res, next) {
        dashboardCtrl.getViagensByPais(req.params.pais, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/visitas', function(req, res, next) {
    dashboardCtrl.getVisitas(function(err, result) {
    if(err)
        return res.status(400).jsonp(tools.parseError(err));        
        
    return res.status(200).jsonp(tools.parseData(result)); 
});
});
module.exports = router;