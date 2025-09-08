import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  refunded: { type: Boolean, default: false }
},{ timestamps: true });

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
},{ timestamps: true });

export default mongoose.model('Wallet', walletSchema);