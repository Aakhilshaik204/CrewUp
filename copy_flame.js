const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\aakhi\\.gemini\\antigravity\\brain\\85e7fa7b-e3a8-4ae0-ad0f-276810990db2';
const destDir = path.join(__dirname, 'client', 'public', '3d');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = {
  'icon_flame_1783073617970.png': 'icon_flame.png'
};

for (const [srcFile, destFile] of Object.entries(filesToCopy)) {
  fs.copyFileSync(path.join(srcDir, srcFile), path.join(destDir, destFile));
}

console.log('Flame image copied successfully.');
