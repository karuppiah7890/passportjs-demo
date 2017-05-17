const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: String,
  username: String,
  provider: String,
  displayName: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;
