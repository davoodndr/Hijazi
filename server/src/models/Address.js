import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line: {
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
    default: ""
  },
  is_default: {
    type: Boolean,
    default: false
  },
},{timestamps: true});

const Address = mongoose.model('Address',addressSchema);

export default Address