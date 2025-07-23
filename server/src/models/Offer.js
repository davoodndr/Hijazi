import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
	{
		title: String,
		type: { type: String, enum: ['offer', 'coupon'], required: true },
		couponCode: { 
      type: String, 
      unique: true, 
      uppercase: true,
			sparse: true
    },
		discountType: {
			type: String,
			enum: ["percentage", "fixed", "bogo"],
			required: true,
		},
		discountValue: {
			type: Number,
			required: true,
		},
		minPurchase: {
			type: Number,
			default: 0,
		},
		maxDiscount: {
			type: Number,
			default: 0
		},
		startDate: Date,
  	endDate: Date,
		usageLimit: {
			type: Number,
			default: 0
		},
  	usagePerUser: {
			type: Number,
			default: 1
		},
		applicableCategories: [String], // stores slug, for simpliciy
		applicableProducts: [String], // stores sku to capture variants
		status: {
			type: String,
			enum: ["active", "inactive", "expired"],
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

export default mongoose.model("Offer", offerSchema);
