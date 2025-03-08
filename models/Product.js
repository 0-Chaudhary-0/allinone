const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true }, // SEO-friendly URL identifier
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  variants: [
    {
      color: { type: String, required: true },
      images: [{ type: String }], // Array of image URLs
      sizes: [
        {
          size: { type: String, required: true }, // Example: "S", "M", "L", "XL"
          stock: { type: Number, required: true } // Stock per size
        }
      ]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductsSchema);
