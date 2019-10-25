const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');
const { DolphinSR, generateId } = require('dolphinsr');
const { Card, Review } = require('../src/model');
const { polishCard } = require('./dictionary');

const sr = new DolphinSR();
let currentCard = null;

async function importCards() {
  const importFilePath = path.join(__dirname, '..', 'data', 'imports.json');
  if (!fs.existsSync(importFilePath)) {
    return;
  }
  const newCards = JSON.parse(fs.readFileSync(importFilePath, 'utf-8'));
  let numImported = 0;

  for (const word of newCards) {
    if (await Card.findOne({ where: { text: word } })) {
      continue;
    }
    await Card.create({ id: generateId(), text: word });
    numImported += 1;
  }

  fs.writeFileSync(importFilePath, '[]');
  console.log(`${numImported} ${pluralize('word', numImported)} had been imported.`);
}

async function initialize() {
  await importCards();

  const combination = { front: [0], back: [0] };
  const combinations = [combination];

  const startTime = new Date();

  // fetch and load cards
  const cards = await Card.findAll().map(card => {
    return { id: card.id, combinations, fields: [card.text] };
  });
  sr.addMasters.apply(sr, cards);

  // fetch and load reviews
  const reviews = await Review.findAll().map(review => {
    return {
      master: review.master,
      combination,
      ts: review.time,
      rating: review.rating,
    };
  });
  sr.addReviews.apply(sr, reviews);

  console.log(`Memorization initialized. Elapsed time: ${new Date() - startTime}`);
}

function refreshCard() {
  currentCard = polishCard(sr.nextCard());
}

function getCurrentCard() {
  if (currentCard === null) {
    refreshCard();
  }
  return currentCard;
}

async function updateReview(rating) {
  sr.addReviews({
    master: currentCard.master,
    combination: currentCard.combination,
    ts: new Date(),
    rating
  });
  await Review.create({ master: currentCard.id, time: new Date(), rating });
  refreshCard();
}

function summary() {
  return sr.summary();
}

module.exports = {
  initialize,
  getCurrentCard,
  updateReview,
  summary,
};
