// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt    = require('jsonwebtoken');
var userCtrl = require('../controllers/utilizadores.js');

// load the auth variables
var configAuth = require('../config/main');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {        
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userCtrl.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },  function(req, username, password, done) {
            userCtrl.find({email: username}, {}, function(err, users){
                if (err)
                    return done(err);
                    
                var user = users[0];

                if (!user)
                    return done(new Error('Utilizador inexistente!'));

                if (!user.comparePassword(password))
                    return done(new Error('Password inválida!'));

                const payload = {
                    admin: user._doc.perfil 
                    };
    
                var token = jwt.sign(payload, configAuth.secret, {
                    //expiresInMinutes: 1440 // expires in 24 hours
                });
                user._doc.token = token;
                
                return done(null, user);
            });
        }
    ));

    passport.use('fb', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'facebookID',
        passReqToCallback: true
    }, 
    function(req, username, password, done) {
         userCtrl.find({ 'facebook.id': password }, {}, function(err, users){
             if (err)
                return done(err);

            var user = users[0];

            if (!user){
                return done(new Error('Utilizador inexistente!'));
            }
            
            const payload = {
                admin: user._doc.perfil 
              };

            var token = jwt.sign(payload, configAuth.secret, {
                //expiresInMinutes: 1440 // expires in 24 hours
            });
            user._doc.token = token;

            return done(null, user);
        });
    }
    ));

    passport.use('id', new LocalStrategy({
        usernameField: 'email_user',
        passwordField: 'id_user',
        passReqToCallback: true
    }, 
    function(req, username, password, done) {
         userCtrl.find({'id': password}, {}, function(err, users){
             if (err)
                return done(err);

            var user = users[0];

            if (!user){
                return done(new Error('Utilizador inexistente!'));
            }

            const payload = {
                admin: user._doc.perfil 
              };

            var token = jwt.sign(payload, configAuth.secret, {
                //expiresInMinutes: 1440 // expires in 24 hours
            });
            user._doc.token = token;
            
            return done(null, user);
        });
    }
    ));

    // FACEBOOK ================================================================
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebook.clientID,
        clientSecret    : configAuth.facebook.clientSecret,
        callbackURL     : configAuth.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    },
    function(token, refreshToken, profile, done) {        
        process.nextTick(function() {
            userCtrl.find({ 'facebook.id' : profile.id }, {}, function(err, users){
                if (err)
                    return done(err);

                var user = users[0];

                if (user)
                    return done(null, user);
                
                var newUser = {};
                newUser.nome = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.foto = 'http://graph.facebook.com/'+profile.id+'/picture?type=large';
                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;

                userCtrl.insert(newUser, function(err, user){
                    if (err)
                        return done(err);

                    const payload = {
                        admin: user._doc.perfil 
                        };
        
                    var token = jwt.sign(payload, configAuth.secret, {
                        //expiresInMinutes: 1440 // expires in 24 hours
                    });
                    user._doc.token = token;
                    
                    return done(null, user);
                });
            })
        });
    }));
};
