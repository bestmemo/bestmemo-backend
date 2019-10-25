const { DolphinSR, generateId } = require('dolphinsr');
const { Card, Review } = require('../src/model');
const { polishCard } = require('./dictionary');

const sr = new DolphinSR();
let currentCard = null;

async function initialize() {
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
