import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/tmp' 
  : path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize a JSON file if it doesn't exist
function initFile(filename, defaultData = []) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
}

// Initialize all data files with seed data
// Admin password is pre-hashed with bcrypt (password: 'admin123')
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);
initFile('admin_login.json', [
  { userid: 1111, username: 'ritika', password: ADMIN_HASH }
]);

initFile('kanya_register.json', []);
initFile('kanya_contact.json', []);
initFile('help_request.json', []);
initFile('donate.json', []);
initFile('ngo_applications.json', []);
initFile('notifications.json', []);

// Initialize NGOs with seed data
initFile('ngos.json', [
  {
    id: 1, name: 'Saheli Foundation', email: 'contact@saheli.org', phone: '9876543210',
    services: ['education', 'domestic'], address: 'Sector 12, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh',
    lat: 26.8467, lng: 80.9462, status: 'approved', website: 'https://saheli.org',
    description: 'Empowering girls through education and domestic support.'
  },
  {
    id: 2, name: 'Jan Swasthya Sahyog', email: 'info@jssbilaspur.org', phone: '9123456780',
    services: ['medical', 'mental-health'], address: 'Ganiyari, Bilaspur', city: 'Bilaspur', state: 'Chhattisgarh',
    lat: 22.0797, lng: 82.1409, status: 'approved', website: 'https://jssbilaspur.org',
    description: 'Free medical and mental health services for rural communities.'
  },
  {
    id: 3, name: 'Barefoot College', email: 'info@barefootcollege.org', phone: '9988776655',
    services: ['education', 'career'], address: 'Tilonia, Ajmer', city: 'Ajmer', state: 'Rajasthan',
    lat: 26.4499, lng: 74.6399, status: 'approved', website: 'https://barefootcollege.org',
    description: 'Solar engineering, skill training, and career guidance for rural women.'
  },
  {
    id: 4, name: 'Pratham Education', email: 'contact@pratham.org', phone: '9112233445',
    services: ['education'], address: 'Andheri, Mumbai', city: 'Mumbai', state: 'Maharashtra',
    lat: 19.1136, lng: 72.8697, status: 'approved', website: 'https://pratham.org',
    description: 'Quality education for underprivileged children.'
  },
  {
    id: 5, name: 'Majlis Legal Centre', email: 'info@majlislaw.com', phone: '9556677889',
    services: ['legal-aid'], address: 'Dadar, Mumbai', city: 'Mumbai', state: 'Maharashtra',
    lat: 19.0176, lng: 72.8474, status: 'approved', website: 'https://majlislaw.com',
    description: 'Free legal counsel and rights awareness for women.'
  },
]);

// Read data from a JSON file
export function readData(table) {
  const filePath = path.join(DATA_DIR, `${table}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Write data to a JSON file
export function writeData(table, data) {
  const filePath = path.join(DATA_DIR, `${table}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Find rows matching a condition
export function findWhere(table, condition) {
  const data = readData(table);
  return data.filter(row => {
    return Object.keys(condition).every(key => row[key] === condition[key]);
  });
}

// Insert a new row
export function insertRow(table, row) {
  const data = readData(table);
  data.push(row);
  writeData(table, data);
  return row;
}

export default { readData, writeData, findWhere, insertRow };
