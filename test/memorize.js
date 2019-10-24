const { DolphinSR, generateId } = require('dolphinsr');

// Specify the combinations DolphinSR should make out of your master cards.
// Numbers refer to indexes on the card. (Don't worry and keep reading if you don't understand)
const chineseCombinations = [
  {front: [0], back: [1, 2]},
  {front: [1], back: [0, 2]},
  {front: [2], back: [0, 3]}
];
const frenchCombinations = [
  {front: [0], back: [1]},
  {front: [1], back: [0]}
];

// Create the master cards that DolphinSR will use spaced repetition to teach.
// Note: in a real program, you'd want to persist these somewhere (a database, localStorage, etc)
const vocab = [
  {
    id: generateId(),
    combinations: chineseCombinations,
    fields: ['你好', 'nǐ hǎo', 'hello']
  },
  {
    id: generateId(),
    combinations: chineseCombinations,
    fields: ['世界', 'shìjiè', 'world']
  },
  {
    id: generateId(),
    combinations: frenchCombinations,
    fields: ['le monde', 'the world']
  },
  {
    id: generateId(),
    combinations: frenchCombinations,
    fields: ['bonjour', 'hello (good day)']
  }
];

// Create the datastore used to house reviews.
// Again, in a real app you'd want to persist this somewhere.
const reviews = [];

// Create a new DolphinSR instance
const d = new DolphinSR();

// Add all of your vocab to the DolphinSR instance
d.addMasters(...vocab);

// Add any existing reviews to the DolphinSR instance
// (In this example, this doesn't do anything since reviews is empty.)
d.addReviews(...reviews);

// Now, DolphinSR can tell us what card to review next.
// Since generateId() generates a random ID, it could be any of the cards we added.
// For example, it could be:
//     {
//       master: <Id>,
//       combination: {front: [0], back: [1, 2]},
//       front: ['你好'],
//       back: ['nǐ hǎo', 'hello']
//     }
const card = d.nextCard();

// It will also give us statistics on the cards we have:
// Since we added 2 masters with 3 combinations (the Chinese vocab) and 2 masters with 2
// combinations (the French vocab), we will have 10 cards. Since we haven't reviewed any of them
// yet, they will all be in a "learning" state.
const stats = d.summary(); // => { due: 0, later: 0, learning: 10, overdue: 0 }

// Now, we can review the current card (probably triggered by a real app's UI)
// If we already knew the answer, we would create a review saying that it was "easy" to recall:
const review = {
  // identify which card we're reviewing
  master: d.nextCard().master,
  combination: d.nextCard().combination,

  // store when we reviewed it
  ts: new Date(),

  // store how easy it was to remember
  rating: 'easy'
};
reviews.push(review); // in a real app, we'd store this persistently
d.addReviews(review);

// Since we reviewed the current card, and marked it easy to remember, DolphinSR will move it into
// 'review' mode, which resembles classic SM2 spaced repetition. So everything else will still be in
// 'learn' mode, and it will be scheduled to be reviewed later.
console.log(d.summary()); // => { due: 0, later: 1, learning: 9, overdue: 0 }

// This will show the next card to review.
console.log(d.nextCard());
