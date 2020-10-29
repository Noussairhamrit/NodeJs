var express =require('express');
const bodyParser=require('body-parser');
var router=express.Router();
var User=require('../models/user');

var passport=require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

/*** */
router.use(bodyParser.json());

/*** */

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )
///using Facebook for logging in the user

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  /**after the passport.authenticate facebook-token middle ware is executed,
   *  you would have the user already loaded into the request object. */
  if (req.user) {
/**So essentially, the user is sending the access token to the express server, the express server uses 
 * the accessToken to go to Facebook and then fetch the profile of the user. And if the user doesn't exist,
 *  we'll create a new user with that Facebook ID.  */

    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});




/**** */
/*******
checkJWToken. It is quite possible that while the client has logged in and obtained the JSON web token, sometime later, 
the JSON Web Token may expire. And so if the user tries to access from the client side with an expired token to the server
 then the server will not be able to authenticate the user. So at periodic intervals we may wish to cross check to make sure 
 that the JSON web token is still valid. So that is the reason why I am including another endpoint called checkJWTToken, 
 so if you do a get to the checkJWTToken. By including the token into the authorization header, then this call will return a 
 true or false to indicate to you whether the JSON web token is still valid or not. If it is not valid then the client side can
  initiate another login for For the user to obtain a new JSON web token */

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);////dima ba3ad il passport
});

/*********************************************** */
 router.get('/',cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
   User.find({}).then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
   })
 })
/************************************** */
router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
      user.firstname=req.body.firstname;
      if (req.body.lasttname)
      user.lastname=req.body.lastname;

      user.save((err,user)=>{
        if (err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});

      })
      
      });
    }
  });
});
 //*//*//*/*//*//*//*//*//*/*//*/*//*/*//*//* hadha kif da5alna il angular 
router.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }


    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
    }); 
  }) (req, res, next);////dima ba3ad il passport
});

 //*//*//*/*//*//*//*//*//*/*//*/*//*/*//*//*  hadha 9abal manda5lou il angular
/* router.post('/login', cors.corsWithOptions,passport.authenticate('local'), (req, res) => {
  
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'}); */

  //*//*//*/*//*//*//*//*//*/*//*/*//*/*//*//* hadha taba3 i session wil cookies 9abal mayad5ol i token

   /*  if(!req.session.user) {
      var authHeader = req.headers.authorization;
      
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
    
      User.findOne({username: username})
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + username + ' does not exist!');
          err.status = 403;
          return next(err);
        }
        else if (user.password !== password) {
          var err = new Error('Your password is incorrect!');
          err.status = 403;
          return next(err);
        }
        else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!')
        }
      })
      .catch((err) => next(err));
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
    }
     */

      //*//*//*/*//*//*//*//*//*/*//*/*//*/*//*//*
  /* }); */
 
  router.get('/logout',cors.corsWithOptions, (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    } 
  });

module.exports = router;
