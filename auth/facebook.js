module.exports = function(passport) {

  const PORT = process.env.PORT ||  3000;

  const FacebookStrategy = require('passport-facebook').Strategy,
    path = '/auth/facebook',
    returnPath = '/auth/facebook/callback',
    mongoose = require('mongoose'),
    User = mongoose.model('User');

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `http://localhost:${PORT}${returnPath}`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("User profile : ",profile);
      User.findOne({id: profile.id, provider: profile.provider})
      .then((result) => {
          if(result) {
            //console.log("found facebook user in db", result);
            done(null, result);
          } else {
            //console.log("inserting facebook user to db", result);
            User.create(profile)
            .then((result) => {
              done(null, result);
            })
            .catch(err => done(err))
          }
      })
      .catch((err) => {
        done(err);
      })
    }
  ));

  return {
    routes: function(app) {

      app.get(path, passport.authenticate('facebook',
                        { authType: 'rerequest', scope: ['email'] }));

      app.get(returnPath,
                passport.authenticate('facebook',
                          { successReturnToOrRedirect: '/', failureRedirect: path }));
    }
  }
}
