const fs = require('fs');
const path = require('path');

const pluralize = require('pluralize');
const fastify = require('fastify');

const memo = require('./memorization');

// function loadData(filePath) {
//   return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
// }

// const storagePaths = {
//   cards: path.join(__dirname, '..', 'data', 'cards.json'),
//   imports: path.join(__dirname, '..', 'data', 'imports.json'),
//   reviews: path.join(__dirname, '..', 'data', 'reviews.json')
// }

// const storage = mapValues(storagePaths, loadData)

// // import the cards every time launch
// let numImported = 0
// const cardSet = new Set(storage.cards.map(x => x.fields[0]));
// storage.imports.forEach(word => {
//   if (!cardSet.has(word)) {
//     storage.cards.push({
//       id: generateId(),
//       combinations: [{ front: [0], back: [0] }],
//       fields: [word],
//     })
//     cardSet.add(word)
//     numImported += 1
//   }
// })

// initialize the server
const server = fastify({
  logger: true
})

// configure the server

server.register(require('fastify-static'), {
  root: path.join(__dirname, '..', 'dict', 'static')
})

server.get('/current', async (request, reply) => {
  reply.code(200).send({
    currentCard: memo.getCurrentCard(),
    summary: memo.summary(),
  });
})

server.post('/easy', async (request, reply) => {
  await memo.updateReview('easy')
  reply.code(200).send({
    currentCard: memo.getCurrentCard(),
    summary: memo.summary(),
  });
})

server.post('/good', async (request, reply) => {
  await memo.updateReview('good')
  reply.code(200).send({
    currentCard: memo.getCurrentCard(),
    summary: memo.summary(),
  });
})

server.post('/hard', async (request, reply) => {
  await memo.updateReview('hard')
  reply.code(200).send({
    currentCard: memo.getCurrentCard(),
    summary: memo.summary(),
  });
})

server.post('/again', async (request, reply) => {
  await memo.updateReview('again')
  reply.code(200).send({
    currentCard: memo.getCurrentCard(),
    summary: memo.summary(),
  });
})

const start = async () => {
  await memo.initialize();
  try {
    await server.listen(8000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// ignite!
start()
