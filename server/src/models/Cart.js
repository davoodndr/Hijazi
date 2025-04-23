import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1
  },
},{timestamps: true});

const Cart = mongoose.model('Cart',cartSchema);

export default Cart