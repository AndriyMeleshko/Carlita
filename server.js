require('dotenv').config();

const env = process.env;

if (env.app === 'off') require('./app.js');
