var express = require('express');
var router = express.Router();
var path = require('path');
var tools = require(path.join(__dirname, '/../../../tools'));
var bucketlistCtrl = require(path.join(__dirname, '/../../../controllers/bucketlists.js'));


router.get('/utilizador/:id', tools.isAuthenticated, function(req, res, next) {
    bucketlistCtrl.find({ idUtilizador: req.params.id }, {}, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));        
            
        return res.status(200).jsonp(tools.parseData(result)); 
    });
});

router.delete('/:id', tools.isAuthenticated, function(req, res, next) {
    bucketlistCtrl.remove(req.params.id, function(err, result) {
        if(err)
            return res.status(400).jsonp(tools.parseError(err));                

        return res.status(200).jsonp(tools.parseData(result));
    });    
});


module.exports = router;
