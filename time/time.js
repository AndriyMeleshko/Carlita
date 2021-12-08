console.log('File: time.js');

const Sequelize = require('sequelize');
const moment = require('moment');
const fs = require('fs');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: 'time/time.sqlite',
});

const time = sequelize.define('time', {
  name: Sequelize.STRING,
  hours: Sequelize.STRING,
  channelname: Sequelize.STRING,
  channelid: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
});

module.exports = { time };

time.sync();

setInterval(async () => {

  if (fs.existsSync('./time/time.sqlite')) {

    const lTime = await time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: time.js`);
      });

    if (!lTime) {
      const create = await time.create({
        name: 'time',
        hours: '0',
      });

      if (create) {
        console.log(`${moment().utc().locale('en').add(create.hours, 'h').format('hh:mm:ss a')} | New Hours: ${create.hours}`);
      }
    }
  }
}, 1 * 1000);
