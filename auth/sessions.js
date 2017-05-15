module.exports = function(passport, db) {
  const mongoose = require('mongoose'),
    User = mongoose.model('User');

  passport.serializeUser(function(profile, done) {
    console.log('Store the user id : ', profile.id, ' and username in session data store');
    const sessionData = {
      id: profile.id,
      username: profile.username
    };
    done(null, sessionData);
  });

  passport.deserializeUser(function(sessionData, done) {
    // find user using ID stored in session data store and fill in user details in done
    User.findOne({id: sessionData.id, username: sessionData.username})
    .then((result) => {
        console.log("got session id. found in sessions : ", result);
        if(result) {
          done(null, result);
        } else {
          done(null, false);
        }
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
  });
}
