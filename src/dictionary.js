const path = require('path');
const Mdict = require('js-mdict').default;

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
      console.log(`Circular link in the dictionary: ${matchResult[1]}`)
      break
    }
    visited.add(matchResult[1])
    result = mdict.lookup(matchResult[1])
    console.log(`Link to ${matchResult[1]}`)
  }
  return {
    master: card.master,
    combination: card.combination,
    front: card.front[0],
    back: result.definition || '',
  }
}

module.exports = {
  polishCard,
};
