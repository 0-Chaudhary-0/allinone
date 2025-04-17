// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function () {
      // Only require password if the user is not using Google OAuth
      return !this.googleId;
    }
  },
  googleId: {
    type: String
  },
  name: {
    type: String
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
