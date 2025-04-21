import mongoose from "mongoose";

const shippingLabelSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  trackingNumber: { type: String },
  carrier: { type: String },
  status: { type: String, default: 'Processing' },
  estimatedDelivery: { type: Date },
  labelUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('ShippingLabel', shippingLabelSchema);