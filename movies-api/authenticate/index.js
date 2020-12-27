const passport = require('passport');
const passportJWT = require('passport-jwt');
const UserModel = require('./../api/users/userModel');
const dotenv = require('dotenv');

dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET;
const strategy = new JWTStrategy(jwtOptions, async (payload, next) => {
  const user = await UserModel.findByUserName(payload);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
// Authentication and Authorization Middleware
module.exports = {passport}