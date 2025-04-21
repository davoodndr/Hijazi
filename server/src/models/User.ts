import mongoose from "mongoose";

export interface IUser extends Document {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'user' | 'admin';
  wishlist?: mongoose.Types.ObjectId[];
  walletBalance?: number;
  isBanned: boolean;
}

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: { type: String }, // Optional for Google Auth
  googleId: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  walletBalance: { type: Number, default: 0 },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);