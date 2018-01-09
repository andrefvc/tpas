var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../toolsV1'));
//var viagem = require(path.join(__dirname, '../../../models/viagem'));
var locals = require(path.join(__dirname, '/locals'));

var path = 'viagens';

//index
router.get('/index', function(req, res, next) {
    var paises = locals.getPaises();

  res.render('viagem', { title: 'Adicionar Viagem', paises: paises });
});

// Obtem todas as viagens
router.get('/', function(req, res, next) {


  tools.readFiles(path, function(json){
        res.jsonp(json);
    });
});

// Obtem uma viagem
router.get('/:id', function(req, res, next) {
    var id = req.params.id;
    tools.readFile(path, id, function(json){
        res.jsonp(json);
    });
});

// Obtem uma viagem
router.get('/viagensByCidade/:cidade', function(req, res, next) {
    var cidade = req.params.cidade;
    tools.readFiles(path, function(json){

        var result =[];
        json.Data.forEach(function(item){
            if (item.cidade.indexOf(cidade) > -1)
            result.push(item);
        })
        json.Data = result;

        res.jsonp(json);
    });
});

// Atualiza uma viagem
router.put('/:id', function(req, res, next) {
    var id = req.params.id;

    res.jsonp(json);
});

// Remove uma viagem
router.delete('/:id', function(req, res, next) {
    var id = req.params.id;
    tools.fileDelete(path, id, function(json){
        res.jsonp(json);
    });
});

// Insere uma nova viagem
router.post('/', function (req, res) {

    var v = new viagem.viagem();
    v.id = req.body.id;
    v.pais = req.body.pais;
    v.cidade = req.body.cidade;
    v.dataInicio = req.body.dataInicio;
    v.dataFim = req.body.dataFim;
    v.descricao = req.body.descricao;
    v.sumClass1 = 0;
    v.sumClass2 = 0;
    v.sumClass3 = 0;

    tools.writeFile(path, v.id, v, function(json){
        if (json.ErrorCode != 200){
            res.jsonp(json);
            return;
        }
        
        res.jsonp(json);
    });
});


// Atualiza uma viagem
router.get('/delete', function(req, res, next) {
    console.log(1);
    tools.deleteAll('viagens', function(json){
        res.jsonp(json);
    }); 

    tools.deleteAll('momentos', function(json){
        res.jsonp(json);
    }); 

});

module.exports = router;