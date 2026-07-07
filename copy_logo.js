const fs = require('fs');
const path = require('path');

fs.copyFileSync(
  path.join(__dirname, 'logo.jpeg'),
  path.join(__dirname, 'client', 'public', 'logo.jpeg')
);

console.log('Logo copied successfully.');
