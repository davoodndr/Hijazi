import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String },
  review: { type: String },
  status: {
    type: String,
    default: 'approved',
    enum: ['pending', 'approved', 'hidden'],
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);