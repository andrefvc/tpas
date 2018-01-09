var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));

router.get('/lat/:lat/lng/:lng', tools.isAuthenticated, function(req, res, next){
    tools.getLocalizacao(req.params.lat, req.params.lng, function(err, data){
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/cidade/:cidade/pais/:pais', tools.isAuthenticated, function(req, res, next){
    tools.getCoordinates(req.params.cidade, req.params.pais, function(err, data){
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/meteo/lat/:lat/lng/:lng', tools.isAuthenticated, function(req, res, next){
    tools.getTemperatureAtCoords(req.params.lat, req.params.lng, function(err, result){
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
           
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.get('/meteo/cidade/:cidade/pais/:pais', tools.isAuthenticated, function(req, res, next){
    tools.getTemperatureAt(req.params.cidade, req.params.pais, function(err, data){
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

module.exports = router;