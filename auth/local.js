module.exports = function(passport) {

  const LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User');


  passport.use(new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
      User.findOne({username: username, password: password})
      .then((result) => {
          if(result) {
            //console.log("found local user in db", result);
            done(null, result);
          } else {
            req.flash('message','Invalid username or password');
            done(null, false);
          }
      })
      .catch((err) => {
        done(err);
      });
    }
  ));

  return {
    routes: function(app) {
      app.post('/login',
                passport.authenticate('local', { successRedirect: '/',
                                                 failureRedirect: '/login'}));

       app.get('/signup', (req,res) => {
         res.render('signup.html', { message: req.flash('info') });
       });

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
       });
    }
  }

}
