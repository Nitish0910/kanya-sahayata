import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  donate_type: { type: String, required: true },
  description: { type: String },
  quantity: { type: String }
}, { timestamps: true });

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
