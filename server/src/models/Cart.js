import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1
  },
  variant_id: String,
  attributes: Object
})

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  items: [cartItemSchema]
  
},{timestamps: true});

const Cart = mongoose.model('Cart',cartSchema);

export default Cart