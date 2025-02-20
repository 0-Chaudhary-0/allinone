// models/User.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200, // Ensure max length isn't too low
    },
  });

module.exports = mongoose.model('Comment', CommentSchema);
