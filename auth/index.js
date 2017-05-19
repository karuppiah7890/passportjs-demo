module.exports = function() {


  const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  local = require('./local')(passport),
  twitter = require('./twitter')(passport),
  facebook = require('./facebook')(passport),
  sessions = require('./sessions');
  sessions(passport);

  return {
    init: function(app) {
      app.use(passport.initialize());
      app.use(passport.session());

      app.get('/signup', (req,res) => {
        res.render('signup.html', { message: req.flash('info') });
      })

      app.post('/signup', (req,res) => {
        //console.log(req.body);
        if(req.body.username === '' || req.body.password === '') {
          req.flash('info', 'Fill in all fields!');
          res.redirect('/signup');
        }
        User.findOne({username: req.body.username})
        .then((result) => {
            if(result) {
              //console.log("found local user in db", result);
              req.flash('info', 'Username already exists');
              res.redirect('/signup');
            } else {
              const profile = {
                id: Math.floor(Math.random() * 10000000000),
                username: req.body.username,
                password: req.body.password,
                displayName: req.body.username,
                provider: 'local'
              };
              User.create(profile)
              .then((result) => {
                req.login(profile, function(err) {
                  if(err) {
                    return console.log(err);
                  }
                  return res.redirect('/');
                });
              })
              .catch(err => console.log(err));
            }
        })
        .catch((err) => {
          done(err);
        });
      })

      app.get('/login', (req,res) => {
        res.render('login.html', { message: req.flash('failureFlash') });
      });

      local.routes(app);
      twitter.routes(app);
      facebook.routes(app);

      app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
      });

    }
  }
}
