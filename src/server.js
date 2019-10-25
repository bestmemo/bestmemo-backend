const path = require('path');
const fastify = require('fastify');
const memo = require('./memorization');

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
