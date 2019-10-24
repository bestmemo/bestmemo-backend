const Mdict = require('js-mdict').default;
const path = require('path');
const fs = require('fs');
const prompts = require('prompts');

const dictFolder = path.join(__dirname, '..', 'dict');
const dictFileName = fs
  .readdirSync(dictFolder)
  .find(x => path.extname(x) === '.mdx')

if (dictFileName) {
  console.log(`Use dict: ${dictFileName}`);
  const dict = new Mdict(path.join(dictFolder, dictFileName));

  async function loop() {
    while (true) {
      const { query } = await prompts({
        type: 'text',
        name: 'query',
        message: 'Please enter a word, or ".quit" to exit',
      });
      if (query === '.quit') {
        break;
      }
      console.log(dict.lookup(query));
    }
  }

  loop();
} else {
  console.log('Please put one MDict file in `dict` folder');
}
