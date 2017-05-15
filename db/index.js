const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('error', function(err) {
  console.error(err);
});

connection.once('open', function() {
  console.log('Connected to MongoDB!');
})

require('./user');
