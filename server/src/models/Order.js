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
    category: mongoose.Schema.Types.Mixed,
    appliedOffer: {
      _id: String,
      appliedAmount: Number,
      status: String
    },
    status: { type: String, default: 'pending' },
    tax: Number,
    cancelSummery: {
      _id: String,
      user_id: String,
      name: String,
      role: String,
      date: Date,
      reason: String,
      refundAmount: Number,
      refundStatus: String,
      appliedCoupon: {
        _id: String,
        appliedAmount: Number,
        status: String
      },
      cartOffer: {
        _id: String,
        appliedAmount: Number,
        status: String
      }
    }
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
  paymentInfo: {
    transaction_id: String,
    paymentMethod: { type: String },
    paymentResult: {type:mongoose.Schema.Types.Mixed, default: null},
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date }
  },
  itemsPrice: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  appliedCoupon: {
    _id: String,
    appliedAmount: Number,
    status: String
  },
  cartOffer: {
    _id: String,
    appliedAmount: Number,
    status: String
  },
  deliveryInfo: {
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    invoice: {
      date: { type: Date },
      invoiceNumber: { type: Number }
    }
  },
  status: { 
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out-for-del', 'delivered', 'cancelled', 'failed', 'returned', 'on-hold', 'refunded' ],
    default: 'pending' 
  },
  cancelSummery: {
    user_id: String,
    name: String,
    role: String,
    date: Date,
    reason: String,
    refunded: Boolean
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);