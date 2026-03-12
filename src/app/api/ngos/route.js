import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NGO from '@/models/NGO';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service');
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));

    await dbConnect();

    // Query for approved NGOs
    const query = { status: 'approved' };
    
    // Filter by service type if provided
    if (service) {
      query.services = service;
    }

    let ngos = await NGO.find(query).lean();

    // Calculate distance if location is provided
    if (!isNaN(lat) && !isNaN(lng)) {
      ngos = ngos.map(ngo => {
        const distance = calculateDistance(lat, lng, ngo.lat, ngo.lng);
        return { ...ngo, distance: Math.round(distance) };
      });
      // Sort by distance
      ngos.sort((a, b) => a.distance - b.distance);
    }

    return NextResponse.json({ success: true, data: ngos });
  } catch (error) {
    console.error('NGO fetch error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// Haversine formula to calculate distance between two points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}
