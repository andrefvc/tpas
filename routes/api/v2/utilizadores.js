var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var usersCtrl = require(path.join(__dirname, '/../../../controllers/utilizadores.js'));

router.get('/', tools.isAuthenticated, function(req, res, next) {
    var query = {};
    if (req.query.filtro){
            query= { nome: new RegExp('\.*'+req.query.filtro+'\.*', 'i') };
        }

    usersCtrl.find(query, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        

        return res.status(200).jsonp(tools.parseData(result));
    });
});

router.get('/:id', tools.isAuthenticated, function(req, res, next) {    
    usersCtrl.findById(req.params.id, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result[0]));
    });
});

module.exports = router;