const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});
console.log('URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected.');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error connecting:', e);
    process.exit(1);
  });
