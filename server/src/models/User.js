import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: { type: String, unique: true },
		fullname: { type: String, default: '' },
		gender: { type: String, default: '' },
		email: { type: String, unique: true },
		mobile: { type: String, unique: true, sparse: true },
		password: { type: String, default: '' },
		googleId: { type: String, default: '' },
		avatar: { 
			url: String, 
    	public_id: String,
		},
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
		default_address: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Address",
		},
		forgot_password_otp: {
			type: String,
			default: "",
		},
		forgot_password_expiry: {
			type: Date,
			default: "",
		},
		roles: { type: [String], default: ["user"] },
		activeRole: { type: String, default: "user" },
		/* wallet: {
			_id: {type: mongoose.Schema.Types.ObjectId, ref: "Wallet"},
			balance: {type: Number, default: 0 },
		} */
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
