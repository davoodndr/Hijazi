import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true },
		fullname: { type: String, default: '' },
		email: { type: String, unique: true },
		mobile: { type: String, unique: true, sparse: true },
		password: { type: String, default: '' },
		googleId: { type: String, default: '' },
		avatar: { type: String, default: '' },
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
			enum: ["active", "inactive", "blocked"],
			default: "active",
		},
		address_list: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Address",
			},
		],
		default_address: {
			type: mongoose.Schema.ObjectId,
			ref: "Address",
		},
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
		roles: { type: [String], default: ["user"] },
		wallet_balance: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
