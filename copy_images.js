const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\aakhi\\.gemini\\antigravity\\brain\\85e7fa7b-e3a8-4ae0-ad0f-276810990db2';
const destDir = path.join(__dirname, 'client', 'public', '3d');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = {
  'dashboard_hero_1783072979505.png': 'dashboard_hero.png',
  'icon_cricket_1783072989224.png': 'icon_cricket.png',
  'icon_football_1783072999240.png': 'icon_football.png',
  'icon_badminton_1783073011300.png': 'icon_badminton.png',
  'icon_bgmi_1783073020189.png': 'icon_bgmi.png',
  'icon_gaming_1783073030800.png': 'icon_gaming.png'
};

for (const [srcFile, destFile] of Object.entries(filesToCopy)) {
  fs.copyFileSync(path.join(srcDir, srcFile), path.join(destDir, destFile));
}

console.log('Images copied successfully.');
