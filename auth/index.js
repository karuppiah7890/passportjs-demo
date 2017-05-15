module.exports = function(db) {

  const passport = require('passport');
  const twitter = require('./twitter')(passport, db);
  const sessions = require('./sessions');
  sessions(passport,db);

  return {
    init: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());

      app.get('/signup', (req,res) => {
        res.render('signup.html');
      })

      app.get('/login', (req,res) => {
        res.render('login.html');
      });

      twitter.routes(app);

      app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
      });

    }
  }
}
