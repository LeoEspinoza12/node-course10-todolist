const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/users');

// add the module passport jwt
const JwtStrategy = require('passport-jwt').Strategy;
// add the module extract
const ExtractJwt = require('passport-jwt').ExtractJwt;
// add the module json we token
const jwt = require('jsonwebtoken');


var config = require('./config');


exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// this is a method where we create the token
module.exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 5
  });
};



// this is the function that we are exporting to verify 
// if the token is still valid
exports.verifyTokenUser = (req, res, next) => {
  if (req.headers.cookie) {
    var bearer = req.headers.cookie;
    newtoken = bearer.split('=')
    token = newtoken[1]
    jwt.verify(token, config.secretKey, (err, authData) => {
      if (err) {
        console.log(err)
        res.redirect('/')
      } else {
        next()
      }
    })
  } else {
    console.log('cookie has expired')
    return false
  }
}


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey;


//////////////////////////////////////////////////////////////
module.exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("\nJWT Payload here: ", jwt_payload)
      console.log("\nopts: ", opts)

    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if (err) {
        return done(err, false)
      } else if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  }));
module.exports.verifyUser = passport.authenticate('jwt', {session: false});



