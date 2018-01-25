module.exports = {  
'database': 'mongodb://sa:sa@ds139342.mlab.com:39342/tripstogether'  ,
'secret': 'ilovescotchyscotch',

//// dev
'facebook': {
    clientID: '105701353575403',
    clientSecret: '4932f405dd5ed47fe96f5c7fa4d47bc0',
    callbackURL: 'http://http://localhost:3000/auth/facebook/callback'
  }

  //// prod
  /*
  'facebook': {
    clientID: '415025925564529',
    clientSecret: '7ec3a0153fe31e6656250611972c45ad',
    callbackURL: 'https://tppweb.herokuapp.com/auth/facebook/callback'
  }
  */
};