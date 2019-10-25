if (process.argv.length !== 3) {
  console.log('Usage: node scripts/import.js [input.txt]')
} else {
  const fs = require('fs');
  const path = require('path');
  const input = process.argv[2];
  let words = fs.readFileSync(input, 'utf-8').split('\n');
  // remove blank lines
  words = words.filter(x => !!x);
  // remove leading and trailing spaces
  words = words.map(x => x.trim());
  const filePath = path.join(__dirname, '..', 'data', 'imports.json');
  const existingWords = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  fs.writeFileSync(filePath, JSON.stringify(existingWords.concat(words)));
}
