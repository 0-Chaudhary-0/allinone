// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Comment', UserSchema);
