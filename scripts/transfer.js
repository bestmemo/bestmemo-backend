const { mapValues } = require('lodash');
const { Card, Review } = require('../src/model');
const fs = require('fs');
const path = require('path');

function loadData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const storagePaths = {
  cards: path.join(__dirname, '..', 'data', 'cards.json'),
  reviews: path.join(__dirname, '..', 'data', 'reviews.json')
};

const storage = mapValues(storagePaths, loadData);

async function main() {
  for (const card of storage.cards) {
    await Card.create({ id: card.id, text: card.fields[0] });
  }
  for (const review of storage.reviews) {
    await Review.create({
      master: review.master,
      time: new Date(review.ts),
      rating: review.rating,
    });
  }
}

main();
