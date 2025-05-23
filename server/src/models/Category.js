import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    url: String, 
    public_id: String,
  },
  thumb: {
    url: String, 
    public_id: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  attributes: [
    {
      name: { type: String, required: true }, // e.g., "Size"
      values: [String]                        // e.g., ["S", "M", "L"]
    }
  ],
  order: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);