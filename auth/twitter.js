module.exports = function(passport, config) {

  const TwitterStrategy = require('passport-twitter').Strategy,
        path = '/auth/twitter',
        returnPath = '/auth/twitter/callback',
        mongoose = require('mongoose'),
        User = mongoose.model('User');

  passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${config.serverUrl}${returnPath}`
    },
    function(token, tokenSecret, profile, done) {
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

        app.get(path, passport.authenticate('twitter'));

        app.get(returnPath,
                  passport.authenticate('twitter',
                            { successReturnToOrRedirect: '/', failureRedirect: path }));
      }
  }

}
