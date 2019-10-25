const fs = require('fs');
const path = require('path');

if (process.argv.length === 4) {
  const [, , cardToFix, newContent] = process.argv;
  const filePath = path.join(__dirname, '..', 'data', 'cards.json');
  const cards = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const theCard = cards.find(x => x.fields[0] === cardToFix);
  if (theCard) {
    theCard.fields[0] = newContent;
    fs.writeFileSync(filePath, JSON.stringify(cards));
    console.log('Done');
  } else {
    console.log(`The card with name ${cardToFix} does not exists.`);
  }
} else {
  console.log('Usage: node scripts/fix.js [cardToFix] [newContent]');
}
