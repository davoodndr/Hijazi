import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  rating: { type: Number, required: true },
  comment: String,
},{ timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, unique: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number },
  tax: { 
    type: Number,
    default: 5
  },
  stock: { type: Number, default: 0 },
  description: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  images: [{
    url: String,
    thumb: String,
    public_id: String,
  }],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
  archived: { type: Boolean, default: false },
  customAttributes: [
    {
      name: { type: String },
      values: [String]
    }
  ],
  variants: [
    {
      attributes: mongoose.Schema.Types.Mixed, // e.g., { Size: "M", Color: "Red" }
      sku: { type: String, unique: true },
      price: Number,
      stock: Number,
      image: {
        url: String,
        thumb: String,
        public_id: String
      }
    }
  ],
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);