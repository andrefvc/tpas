var express = require('express');
var router = express.Router();
var path = require('path');
var country = require('countryjs');
var tools = require(path.join(__dirname, '/../../../toolsV1'));

// Devolve todos os países
router.get('/paises', function(req, res, next) {

    var json = new tools.responseJSON();
    json.Data = getPaises();

    res.jsonp(json);
});

// Devolve todas as cidades de um país
router.get('/cidades/:pais', function(req, res, next) {

    var cidades = getCidades(req.params.pais);

    var json = new tools.responseJSON();
    json.Data = cidades;

    res.jsonp(json);
});



// métodos privados

var getPaises = function(){
    var paises = [];
    var obj = country.all();
    for (var index = 0; index < obj.length; index++) {
        paises.push(obj[index].name);
    }
    return paises;
}

var getCidades = function(pais){
    var obj = country.states(pais, 'name');
    return obj;
}

module.exports = router;
module.exports.getPaises = getPaises;
module.exports.getCidades = getCidades;