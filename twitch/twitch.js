const tTime = require('../time/time.js');

const fs = require('fs');
const moment = require('moment');

setTimeout(async () => {

  if (fs.existsSync('./time/time.sqlite')) {

    const lTime = await tTime.time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: twitch.js`);
      });

    if (lTime) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | File: twitch.js`);
    }
  }
});
