import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user_id:{
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  full_name: {
    type: String,
    default: ""
  },
  address_line: {
    type: String,
    default: ""
  },
  landmark: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: "india"
  },
  pincode: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: "",
    sparse: true
  },
  is_default: {
    type: Boolean,
    default: false
  },
},{timestamps: true});

const Address = mongoose.model('Address',addressSchema);

export default Address