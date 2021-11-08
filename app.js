console.log('file app');

const fs = require('fs');

const env = process.env;

if (fs.existsSync('./time/time.js')) {
  if (env.time === 'on') {
    require('./time/time.js');
  }
  else {
    console.log('Disabled File: ./time/time.js');
  }
}
else {
  console.log('Missing File: ./time/time.js');
}

if (fs.existsSync('./discord/discord.js')) {
  if (env.discord === 'on') {
    require('./discord/discord.js');
  }
  else {
    console.log('Disabled File: ./discord/discord.js');
  }
}
else {
  console.log('Missing File: ./discord/discord.js');
}
