const fs = require('fs');
const path = require('path');
const dataFolder = path.join(__dirname, '..', 'data');

fs.writeFileSync(path.join(dataFolder, 'cards.json'), '[]');
fs.writeFileSync(path.join(dataFolder, 'imports.json'), '[]');
fs.writeFileSync(path.join(dataFolder, 'reviews.json'), '[]');
