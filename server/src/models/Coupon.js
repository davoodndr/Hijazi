import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
	{
		code: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true 
    },
		discountType: {
			type: String,
			enum: ["percentage", "fixed"],
			required: true,
		},
		discountValue: {
			type: Number,
			required: true,
		},
		minPurchase: {
			type: Number,
			required: true,
			default: 0, // optional: minimum order amount to apply
		},
		maxDiscount: {
			type: Number,
			default: 0
		},
		expiry: {
			type: Date,
			required: true,
		},
		usageLimit: {
			type: Number,
			default: 1,
		},
		couponRule: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			enum: ["active", "inactive", "expired"],
			required: true,
			default: "active",
		},
		usedBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
