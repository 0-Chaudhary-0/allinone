const mongoose = require('mongoose');
const { Schema } = mongoose;

const RatingSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // optional if login system
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  review: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);