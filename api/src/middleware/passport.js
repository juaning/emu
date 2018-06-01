// const { JwtStrategy, ExtractJwt } = require('passport-jwt');
// const { User } = require('../models');
// const CONFIG = require('./../../config/config');
// require('./../../global_functions');

// module.exports = (passport) => {
module.exports = () => {
  // const opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  // opts.secretOrKey = CONFIG.jwt_encryption;

  // passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  //   const [err, user] = await to(User.findById(jwt_payload.user_id));

  //   if (err) return done(err, false);
  //   if (user) return done(null, user);
  //   return done(null, false);
  // }));
};
