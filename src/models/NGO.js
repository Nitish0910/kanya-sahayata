import mongoose from 'mongoose';

const NGOSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: { type: [String] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  website: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.NGO || mongoose.model('NGO', NGOSchema);
