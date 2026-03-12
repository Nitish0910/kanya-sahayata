import mongoose from 'mongoose';
import Admin from '@/models/Admin';
import NGO from '@/models/NGO';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function seedDatabase() {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('Seeding default admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        userid: 'ADMIN-001',
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin created.');
    }

    // 2. Seed NGOs
    const ngoCount = await NGO.countDocuments();
    if (ngoCount === 0) {
      console.log('Seeding default NGOs...');
      const defaultNGOs = [
        {
          id: 1,
          name: "Sashakt Kanya Foundation",
          description: "Focused on girls' education and self-defense training.",
          services: ["Education", "Self-defense", "Mentorship"],
          phone: "9876543210",
          email: "contact@sashaktkanya.org",
          website: "www.sashaktkanya.org",
          address: "123, Ring Road, Lajpat Nagar",
          city: "New Delhi",
          state: "Delhi",
          lat: 28.5678,
          lng: 77.2433,
          status: "approved"
        },
        {
          id: 2,
          name: "Balika Suraksha Pratisthan",
          description: "Providing legal aid and counseling for gender-based violence.",
          services: ["Legal Aid", "Counseling", "Shelter"],
          phone: "9123456789",
          email: "help@balikasuraksha.in",
          website: "www.balikasuraksha.in",
          address: "45, MG Road, Residency Area",
          city: "Indore",
          state: "Madhya Pradesh",
          lat: 22.7196,
          lng: 75.8577,
          status: "approved"
        },
        {
          id: 3,
          name: "Udaan Girls Mentorship",
          description: "Connecting young girls with professional mentors for career guidance.",
          services: ["Mentorship", "Skill Development", "Career Counseling"],
          phone: "9988776655",
          email: "info@udaanmentorship.org",
          website: "www.udaanmentorship.org",
          address: "88, Tech Park, Sector 5, Salt Lake",
          city: "Kolkata",
          state: "West Bengal",
          lat: 22.5726,
          lng: 88.3639,
          status: "approved"
        },
        {
          id: 4,
          name: "Nari Swasthya Kendra",
          description: "Focusing on menstrual hygiene management and reproductive health.",
          services: ["Healthcare", "Hygiene Kits", "Awareness Camp"],
          phone: "8877665544",
          email: "care@nariswasthya.org",
          website: "www.nariswasthya.org",
          address: "Plot 12, Health City, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          lat: 17.4325,
          lng: 78.4070,
          status: "approved"
        },
        {
          id: 5,
          name: "Beti Bachao Trust",
          description: "Working against female infanticide and promoting equal rights.",
          services: ["Advocacy", "Financial Aid", "Community Outreach"],
          phone: "9112233445",
          email: "reachus@betibachao.org",
          website: "www.betibachao.org",
          address: "5A, Heritage Walk, Old City",
          city: "Jaipur",
          state: "Rajasthan",
          lat: 26.9124,
          lng: 75.7873,
          status: "approved"
        }
      ];
      await NGO.insertMany(defaultNGOs);
      console.log('Default NGOs created.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
      console.log('Connected to MongoDB');
      // Run seed check after successful connection
      await seedDatabase();
      return mongooseInstance;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
