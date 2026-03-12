import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true } // bcrypt hashed
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
