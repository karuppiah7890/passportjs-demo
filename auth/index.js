module.exports = function(config) {


  const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  local = require('./local')(passport),
  twitter = require('./twitter')(passport, config),
  facebook = require('./facebook')(passport, config),
  google = require('./google')(passport, config),
  sessions = require('./sessions');
  sessions(passport);

  return {
    init: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());

      app.get('/login', (req,res) => {
        res.render('login.html', { message: req.flash('message') });
      });

      local.routes(app);
      twitter.routes(app);
      facebook.routes(app);
      google.routes(app);

      app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
      });

    }
  }
}
