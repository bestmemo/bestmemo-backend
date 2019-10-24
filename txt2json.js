if (process.argv.length !== 4) {
  console.log('Usage: node txt2json.js [input.txt] [output.json]')
} else {
  const fs = require('fs');
  const input = process.argv[2];
  const output = process.argv[3];
  let words = fs.readFileSync(input, 'utf-8').split('\n');
  // remove blank lines
  words = words.filter(x => !!x);
  // remove leading and trailing spaces
  words = words.map(x => x.trim());
  fs.writeFileSync(output, JSON.stringify(words));
}
