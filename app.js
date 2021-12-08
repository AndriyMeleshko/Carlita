console.log('File: app.js');

const fs = require('fs');

const env = process.env;

// Modules: Time, Discord, Twitch

// Time
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

// Discord
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

// Twitch
if (fs.existsSync('./twitch/twitch.js')) {
  if (env.twitch === 'on') {
    require('./twitch/twitch.js');
  }
  else {
    console.log('Disabled File: ./twitch/twitch.js');
  }
}
else {
  console.log('Missing File: ./twitch/twitch.js');
}
