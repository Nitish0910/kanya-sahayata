import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import NGO from '@/models/NGO';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    
    let result = [];
    
    // Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        userid: 'ADMIN-001',
        username: 'admin',
        password: hashedPassword
      });
      result.push('Default admin created.');
    } else {
      result.push('Admin already exists.');
    }

    // Seed NGOs
    const ngoCount = await NGO.countDocuments();
    if (ngoCount === 0) {
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
      result.push('Default NGOs created.');
    } else {
      result.push('NGOs already exist.');
    }

    return NextResponse.json({ success: true, message: 'Seeding check complete.', logs: result });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
