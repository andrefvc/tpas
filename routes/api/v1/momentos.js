var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../toolsV1'));
//var momento = require(path.join(__dirname, '../../../models/momento'));
var locals = require(path.join(__dirname, '/locals'));
var fs = require('fs');

var fileType = require('file-type');


// index (teste)
router.get('/:idViagem/index', function(req, res, next) {
    var idViagem = req.params.idViagem;

    tools.readFile('viagens',idViagem,function(json){

      var viagem = json.Data;

      var cidades = locals.getCidades(viagem.pais);;
      res.render('momento', { title: 'Adicionar Momentos', cidades: cidades });
    })
});


// obtem todos os momentos de uma viagem
router.get('/:idViagem', function(req, res, next) {
    var idViagem = req.params.idViagem;
    console.log(idViagem);
    tools.readFilesByCidade('momentos', idViagem,  function(json){
        res.jsonp(json);
    });
});

// obtem um momento de uma viagem
router.get('/:idViagem/:id', function(req, res, next) {
    
    var id = req.params.id;
    var idViagem = req.params.idViagem;
    tools.readFile('momentos', id, function(json){
        res.jsonp(json);
    });
});

// atualiza um momento
router.put('/:idViagem/:id', function(req, res, next) {
    var id = req.params.id;
    var idViagem = req.params.idViagem;
  res.jsonp(json);
});

// remove um momento
router.delete('/:idViagem/:id', function(req, res, next) {
    var id = req.params.id;
    var idViagem = req.params.idViagem;
    tools.fileDelete('momentos',id, function(json){
        res.jsonp(json);
    });
});

// insere um momento
router.post('/', function(req, res, next) {
    
    var fileName = '';
    var file = null;
    if (req.body.file != null){
        console.dir("file in body");
        file = req.body.file;
    }
    else if (req.files && req.files.file){
        console.dir("file in files");
        file = req.files.file.data;
    }
        
    if (file){
        var buffer = new Buffer(file.length);
        for (var i = 0; i < file.length; i++) {
            buffer[i] = file[i];
        }        
        var objType = fileType(buffer);
        fileName = tools.guid() + "." + objType.ext;
    }

    var v = new momento.momento();
    v.idViagem = req.body.idViagem;
    v.id = req.body.id;
    v.designacao = req.body.designacao;
    v.narrativa = req.body.narrativa;
    v.cidade = req.body.cidade;
    v.data = req.body.data;
    v.fileName = fileName;
    v.class1 = 0;
    v.class2 = 0;
    v.class3 = 0;

    tools.writeFile('momentos', v.id, v, function(json){
        if (json.ErrorCode != 200){
            res.jsonp(json);
            return;
        }
        if (!file){
            res.jsonp(json);
            return;
        }
        
        tools.fileUpload('momentos/files', fileName, buffer, function(json){
            res.jsonp(json);
        });
    }, true);
});

// classifica um momento
router.post('/classifica/:idViagem/:id/:classifica', function(req, res, next) {
  var idViagem = req.params.idViagem;
    var id = req.params.id;
    var classifica = req.params.classifica;

    // pega no momento com o id
    tools.readFile('momentos',id, function(jsonRead){

        if (jsonRead.ErrorCode != 200){
            res.jsonp(jsonRead);
            return;
        }

        // atribui a classificacao        
        if (classifica == 3)
            jsonRead.Data.class1 += 1;
        if (classifica == 6)
            jsonRead.Data.class2 += 1;
        if (classifica == 9)
            jsonRead.Data.class3 += 1;

        //atualiza o momento
        tools.writeFile('momentos', id, jsonRead.Data, function(jsonSave){
            //res.jsonp(jsonSave);


            // atualiza a viagem com os somatorios
            tools.readFile('viagens', idViagem, function(viagem){

                    if (classifica == 3)
                        viagem.Data.sumClass1 += 1;
                    if (classifica == 6)
                        viagem.Data.sumClass2 += 1;
                    if (classifica == 9)
                        viagem.Data.sumClass3 += 1;

                        
                    tools.writeFile('viagens', idViagem, viagem.Data, function(json){

                        if (json.ErrorCode != 200){
                            res.jsonp(json);
                            return;
                        }
                        
                        res.jsonp(jsonSave);
                        return;
                        
                    }, false);
                });
        }, 
        false);        
    });        
});


router.get('/filtros/momentosByCidade/:cidade', function(req, res, next) {
    var cidade = req.params.cidade;

    tools.readFiles('momentos', function(json){

        var result =[];
        json.Data.forEach(function(item){
            
            if (item.cidade.indexOf(cidade) > -1)
            result.push(item);
        })
        json.Data = result;

        res.jsonp(json);
    });
});

module.exports = router;