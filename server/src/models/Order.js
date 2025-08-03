import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  order_no: { type: String, unique: true },
  cartItems: [{
    product_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: true
    },
    name: String,
    quantity: { type: Number, required: true },
    image: String,
    price: { type: Number, required: true },
    attributes: mongoose.Schema.Types.Mixed,
    variant_id: String,
    sku: String,
    category: String
  }],
  shippingAddress: {
    name: String,
    address_line: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    mobile: String,
  },
  billingAddress: {
    name: String,
    address_line: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    mobile: String,
  },
  paymentMethod: { type: String },
  paymentResult: mongoose.Schema.Types.Mixed,
  itemsPrice: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  appliedCoupon: mongoose.Schema.Types.Mixed,
  appliedOffer: mongoose.Schema.Types.Mixed,
  totalPrice: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  status: { type: String, default: 'pending' }, // Pending, Shipped, Delivered
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);