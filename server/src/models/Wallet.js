import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  paymentInfo: {
    paymentMethod: { type: String, required: true },
    paidAt: { type: Date, default: new Date() },
    detail: mongoose.Schema.Types.Mixed
  },
  description: String,
  relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  refunded: { type: Boolean }
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