var path = require('path');
var userCtrl = require("../../../controllers/utilizadores.js");
var tools = require(path.join(__dirname, '../../../tools'));
var fs = require('fs');

module.exports = function(app, passport) {

  
app.get('/:nome', function (req, res, next) {
    try {
        var data = fs.readFileSync(path.join(__dirname, '../../../data/' + req.params.nome));
        res.setHeader('Content-disposition', 'filename=' + req.params.nome);
    } catch (error) {
        var data = fs.readFileSync(path.join(__dirname, '/../../../public/img/viagem.jpg'));
        res.setHeader('Content-disposition', 'filename=viagem.jpg');
    }
    //res.contentType('image/jpg');
    res.send(data);
  });
  
    // process the login form
    app.post('/api/v2/login', function (req, res, next) {
        var authenticator = passport.authenticate ('local');
        authenticator (req, res, function(err, user){
          if (err)
            return res.status(400).jsonp(tools.parseError(err));

          res.status(200).jsonp(tools.parseData(res.req.user));
        });
    });

    // process the login facebook form
    app.post('/api/v2/loginFacebook', function (req, res, next) {
      console.dir(req.body);
        var authenticator = passport.authenticate ('fb');
        authenticator (req, res, function(err, user){
          if (err)
            return res.status(400).jsonp(tools.parseError(err));

          res.status(200).jsonp(tools.parseData(res.req.user));
        });
    });

    // logout
    app.post("/api/v2/logout", function(req, res) {
      req.logOut();
      res.sendStatus(200);
    });

    // signup
    app.post("/api/v2/registo", function(req, res) {
      var newUser = {};
      newUser.nome = req.body.nome;
      newUser.perfil = req.body.perfil;
      newUser.email = req.body.email;
      newUser.foto = req.body.foto;
      newUser.password = req.body.password;
      newUser.facebook = req.body.facebook;

      userCtrl.insert(newUser, function(err, user){
        if (err) 
          return res.status(400).jsonp(tools.parseError(err));;

          
        var authenticator = passport.authenticate ('local');
        authenticator (req, res, function(err, user){
          if (err)
            return res.status(400).jsonp(tools.parseError(err));

          res.status(200).jsonp(tools.parseData(res.req.user));
        });
      });
    }); 




    // Facebook auth
    app.get('/auth/facebook', function authenticateFacebook (req, res, next) {
      req.session.returnTo = '/#!' + req.query.returnTo; 
      next();
    }, passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', function (req, res, next) {
     var authenticator = passport.authenticate ('facebook', {
       successRedirect: req.session.returnTo ? req.session.returnTo : "/login",
       failureRedirect: '/login'
      });
      delete req.session.returnTo;
      authenticator (req, res, next);
  });
};