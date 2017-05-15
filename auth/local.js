module.exports = function(passport, db) {
  const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');


  passport.use(new LocalStrategy(
    function(username, password, done) {

    }
  ));

  return {
    routes: function(app) {
      app.post('/login', passport.authenticate('local'));
    }
  }

}
