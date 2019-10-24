const fs = require('fs');
const path = require('path');

const Mdict = require('js-mdict').default
const { mapValues } = require('lodash')
const pluralize = require('pluralize')
const fastify = require('fastify')
const { DolphinSR, generateId } = require('dolphinsr')

function loadData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const storagePaths = {
  cards: path.join(__dirname, '..', 'data', 'cards.json'),
  imports: path.join(__dirname, '..', 'data', 'imports.json'),
  reviews: path.join(__dirname, '..', 'data', 'reviews.json')
}

const storage = mapValues(storagePaths, loadData)

// import the cards every time launch
let numImported = 0
const cardSet = new Set(storage.cards.map(x => x.fields[0]));
storage.imports.forEach(word => {
  if (!cardSet.has(word)) {
    storage.cards.push({
      id: generateId(),
      combinations: [{ front: [0], back: [0] }],
      fields: [word],
    })
    cardSet.add(word)
    numImported += 1
  }
})

// synchronize imported cards
if (numImported > 0) {
  console.log(`${numImported} ${pluralize('card', numImported)} imported.`)
  fs.writeFileSync(storagePaths.cards, JSON.stringify(storage.cards))
  fs.writeFileSync(storagePaths.imports, '[]')
}

// create a DolphinSR instance and load cards and reviews
const sr = new DolphinSR()
sr.addMasters(...storage.cards)
sr.addReviews(...storage.reviews.map(review => {
  review.ts = new Date(review.ts)
  return review
}))

// dictionary API
const mdict = new Mdict(path.join(__dirname, '..', 'dict', '牛津高阶8简体.mdx'));

function polishCard(card) {
  // if no card, return no card
  if (card === null) {
    return null
  }
  // polish the back side
  let result = mdict.lookup(card.front[0])
  let visited = new Set();
  visited.add(card.front[0])
  while (result.definition && result.definition.startsWith('@@@LINK=')) {
    const matchResult = result.definition.match(/^@@@LINK=(\w+)/)
    if (visited.has(matchResult[1])) {
      server.log.info(`Circular link in the dictionary: ${matchResult[1]}`)
      break
    }
    visited.add(matchResult[1])
    result = mdict.lookup(matchResult[1])
    server.log.info(`Link to ${matchResult[1]}`)
  }
  return {
    master: card.master,
    combination: card.combination,
    front: card.front[0],
    back: result.definition || '',
  }
}

// the current card, when server receives a request, it will respond with it
let currentCard = polishCard(sr.nextCard())

function updateReview(rating) {
  // construct a review object
  const reviewObject = {
    master: currentCard.master,
    combination: currentCard.combination,
    ts: new Date(),
    rating
  }
  // save it to storage and let Dolphin re-calcuate it
  storage.reviews.push(reviewObject)
  sr.addReviews(reviewObject)
  // update the next card
  currentCard = polishCard(sr.nextCard())
}

process.on('SIGINT', () => {
  fs.writeFileSync(storagePaths.reviews, JSON.stringify(storage.reviews))
  process.exit(0)
})

// configure the server
const server = fastify({
  logger: true
})

server.get('/current', async (request, reply) => {
  reply.code(200).send({ currentCard, summary: sr.summary() })
})

server.post('/easy', async (request, reply) => {
  updateReview('easy')
  reply.code(200).send({ currentCard, summary: sr.summary() })
})

server.post('/good', async (request, reply) => {
  updateReview('good')
  reply.code(200).send({ currentCard, summary: sr.summary() })
})

server.post('/hard', async (request, reply) => {
  updateReview('hard')
  reply.code(200).send({ currentCard, summary: sr.summary() })
})

server.post('/again', async (request, reply) => {
  updateReview('again')
  reply.code(200).send({ currentCard, summary: sr.summary() })
})

server.get('/summary', async (request, reply) => {
  reply.code(200).send(sr.summary())
})

const start = async () => {
  try {
    await server.listen(8000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// ignite!
start()
