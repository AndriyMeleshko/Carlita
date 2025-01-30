console.log('Running file: server.js');

const fs = require('fs');

const { dotenv } = require('./app/app.json');

const env = process.env;

if (dotenv === 'on') {
	if (!fs.existsSync('./node_modules/dotenv')) {
		console.log('Missing module: dotenv');
	}
	else {
		require('dotenv').config();
	}
}
else {
	console.log('Disabled module: dotenv');
}

if (env.app === 'on') {
	if (!fs.existsSync('./app/app.js')) {
		console.log('Missing file: app.js');
	}
	else {
		require('./app/app.js');
	}
}
else {
	console.log('Disabled file: app.js');
}
