import mongoose from 'mongoose';

const HelpRequestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  id_number: { type: String, required: true },
  name: { type: String, required: true },
  user_email: { type: String },
  age: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  aadhar: { type: String },
  service_type: { type: String, required: true },
  description: { type: String },
  user_lat: { type: Number },
  user_lng: { type: Number },
  status: { type: String, enum: ['pending', 'verified', 'assigned', 'completed', 'rejected'], default: 'pending' },
  assigned_ngo: { type: String, default: null },
  admin_remarks: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.HelpRequest || mongoose.model('HelpRequest', HelpRequestSchema);
