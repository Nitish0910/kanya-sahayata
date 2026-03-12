import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String },
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  mobile_number: { type: String },
  age: { type: String },
  id_name: { type: String },
  id_number: { type: String, required: true, unique: true },
  id_issued_state: { type: String },
  income: { type: String },
  pwd_candidate: { type: String },
  address: { type: String },
  nationality: { type: String },
  state: { type: String },
  district: { type: String },
  house_number: { type: String },
  pincode: { type: String },
  father_name: { type: String },
  mother_name: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
