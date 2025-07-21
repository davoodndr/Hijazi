import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
	{
		title: String,
		type: { type: String, enum: ['offer', 'coupon'], required: true },
		code: { 
      type: String, 
      unique: true, 
      uppercase: true 
    },
		discountType: {
			type: String,
			enum: ["percentage", "flat", "bogo"],
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
		usageLimit: Number,
  	usagePerUser: Number,
		applicableCategories: [mongoose.Schema.Types.ObjectId],
		applicableProducts: [mongoose.Schema.Types.ObjectId],
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
