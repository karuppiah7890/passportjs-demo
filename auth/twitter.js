module.exports = function(passport, db) {

  const PORT = process.env.PORT ||  3000;

  const TwitterStrategy = require('passport-twitter').Strategy,
        path = '/auth/twitter',
        returnPath = '/auth/twitter/callback',
        mongoose = require('mongoose'),
        User = mongoose.model('User');

  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/twitter/callback`
    },
    function(token, tokenSecret, profile, done) {
      //console.log(token, "\n\n", tokenSecret, "\n\n", profile);
      User.findOne({id: profile.id, username: profile.username})
      .then((result) => {
          console.log("result in twitter Strategy", result);
          if(result) {
            done(null, result);
          } else {
            User.create(profile);
            done(null, profile);
          }
      })
      .catch((err) => {
        done(err);
      })
  }));

  return {
      routes: function(app) {

        app.get(path, passport.authenticate('twitter'));

        app.get(returnPath,
                  passport.authenticate('twitter',
                            { successReturnToOrRedirect: '/', failureRedirect: '/auth/twitter' }));
      }
  }

}
