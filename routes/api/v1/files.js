var express = require('express');
var router = express.Router();

// devolve ficheiros aramazenados no servidor

router.get('/viagens/:name', function(req, res, next){
    var name = req.params.name;
    res.sendfile('./data/viagens/files/' + name);
});

router.get('/momentos/:name', function(req, res, next){
    var name = req.params.name;
    res.sendfile('./data/momentos/files/' + name);
});


module.exports = router;