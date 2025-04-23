import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String },
		email: { type: String, unique: true },
		mobile: { type: String, unique: true, sparse: true },
		password: { type: String },
		googleId: { type: String },
		avatar: { type: String },
		refresh_token: {
			type: String,
			default: "",
		},
		email_verified: {
			type: Boolean,
			default: false,
		},
		last_login: {
			type: Date,
			default: "",
		},
		status: {
			type: String,
			enum: ["active", "incative", "suspended"],
			default: "active",
		},
		address_details: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Address",
			},
		],
		shopping_cart: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Cart",
			},
		],
		order_history: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Order",
			},
		],
		forgot_password_otp: {
			type: String,
			default: "",
		},
		forgot_password_expiry: {
			type: Date,
			default: "",
		},
		role: { type: String, enum: ["user", "admin"], default: "user" },
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		wallet_balance: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
