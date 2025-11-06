import mongoose, { mongo } from "mongoose";

const wishListItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  variant_id:String,
  attributes: Object,
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  list: [wishListItemSchema]
})

const wishlist = mongoose.model('Wishlist',wishlistSchema);

export default wishlist