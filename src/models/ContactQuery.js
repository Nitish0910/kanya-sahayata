import mongoose from 'mongoose';

const ContactQuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String },
  email_id: { type: String, required: true },
  field: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.ContactQuery || mongoose.model('ContactQuery', ContactQuerySchema);
