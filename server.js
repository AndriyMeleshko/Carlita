require('dotenv').config();

const env = process.env;

if (env.app === 'on') require('./app.js');
