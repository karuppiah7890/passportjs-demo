module.exports = function(passport, config) {

  const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        path = '/auth/google',
        returnPath = '/auth/google/callback',
        mongoose = require('mongoose'),
        User = mongoose.model('User');

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.serverUrl}${returnPath}`
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("User profile : ",profile);
      User.findOne({id: profile.id, provider: profile.provider})
      .then((result) => {
          if(result) {
            //console.log("found twitter user in db", result);
            done(null, result);
          } else {
            //console.log("inserting twitter user to db", result);
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
  }));

  return {
      routes: function(app) {

        app.get(path, passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

        app.get(returnPath,
                  passport.authenticate('google',
                            { successReturnToOrRedirect: '/', failureRedirect: path }));
      }
  }

}
