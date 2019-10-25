const fs = require('fs');
const path = require('path');
const moment = require('moment');

const dataFolder = path.join(__dirname, '..', 'data');
const backupFolder = path.join(dataFolder, moment().format('YYYYMMDD-HHmmss'));

fs.mkdirSync(path.join(backupFolder));

['cards', 'imports', 'reviews']
  .map(x => `${x}.json`)
  .forEach(x => {
    fs.copyFileSync(path.join(dataFolder, x), path.join(backupFolder, x));
  });
