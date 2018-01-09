var express = require('express');
var router = express.Router();
var path = require('path');
var weather = require('weather-js');
var tools = require(path.join(__dirname, '/../../../toolsV1'));

//devolve informação metereologica de uma localização
router.get('/:cidade', function(req, res, next){
    
    var obj = getWeather(req.params.cidade, function(err, data){
        var json = new tools.responseJSON();
        if (err){
        json.ErrorCode = 500;
        json.Error = err;
    }
    else
        json.Data = data;

        res.jsonp(json);
    });
});


// metodos privados

var getWeather = function(cidade, callback){
    weather.find({search: cidade, degreeType: 'C'}, function(err, result) {
            callback(err, result);
    });
}

module.exports = router;