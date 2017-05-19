const PORT = process.env.PORT ||  3000;

const config = require('./config')(PORT)[process.env.APP_ENV];

const express = require('express');
const app = express();
const db = require('./db')(config);
const nunjucks = require('nunjucks');
const ensureLogin = require('connect-ensure-login');
const auth = require('./auth')(config);
const flash = require('connect-flash');

nunjucks.configure('views',{
  autoescaping: true,
  express: app
});

app.use(express.static('public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'Karuppiah is a coder', resave: false, saveUninitialized: false }));
app.use(flash());

auth.init(app);

app.get('/', (req,res) => {
  console.log("Request from User : ",req.user);
  res.render('index.html', {user: req.user});
})


app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
