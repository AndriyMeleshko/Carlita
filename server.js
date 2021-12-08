const fs = require('fs');

if (!fs.existsSync('./node_modules/dotenv')) {
  console.log('Missing Module: dotenv');

  const env = process.env;

  if (env.app === 'on') require('./app.js');
}
else
if (fs.existsSync('./node_modules/dotenv')) {
  require('dotenv').config();

  console.log('Module: dotenv');

  const env = process.env;

  if (env.app === 'on') require('./app.js');
}
