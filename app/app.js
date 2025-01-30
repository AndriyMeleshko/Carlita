const app = require('./app.json');

const env = process.env;

const moment = require('moment-timezone');
const fs = require('fs');

const tables = require('../app/tables.js');

async function safeDBQuery(query) {
	try {
		return await query();
	}
	catch (error) {
		console.error('app.js: Помилка бази даних:', error);
		return null;
	}
}

const log = console.log;

console.log = async function() {
	setTimeout(async () => {
		const lTime = await safeDBQuery(() => tables.time.findOne(
			{ where: { CodeName: 'Time' } }));

		if (!lTime) return;

		log.apply(console, [`${moment().utc().add(lTime.Hours, 'h').format('hh:mm:ss a')} | `, ...arguments]);
	}, 3 * 1000);
};

console.log('Running file: app.js');

// Modules

if (env.discord_js === 'on') {
	if (!fs.existsSync('./node_modules/discord.js')) {
		console.log('Missing module: @discord.js');
	}
}
else {
	console.log('Disabled module: @discord.js');
}

if (env.discord_js_rest === 'on') {
	if (!fs.existsSync('./node_modules/@discordjs/rest')) {
		console.log('Missing module: @discordjs/rest');
	}
}
else {
	console.log('Disabled module: @discordjs/rest');
}

if (env.discord_js_voice === 'on') {
	if (!fs.existsSync('./node_modules/@discordjs/voice')) {
		console.log('Missing module: @discordjs/voice');
	}
}
else {
	console.log('Disabled module: @discordjs/voice');
}

if (env.discord_api_types === 'on') {
	if (!fs.existsSync('./node_modules/discord-api-types')) {
		console.log('Missing module: discord-api-types');
	}
}
else {
	console.log('Disabled module: discord-api-types');
}

if (env.napi_rs_canvas === 'on') {
	if (!fs.existsSync('./node_modules/@napi-rs/canvas')) {
		console.log('Missing module: @napi-rs/canvas');
	}
}
else {
	console.log('Disabled module: @napi-rs/canvas');
}

if (env.bufferutil === 'on') {
	if (!fs.existsSync('./node_modules/bufferutil')) {
		console.log('Missing module: bufferutil');
	}
}
else {
	console.log('Disabled module: bufferutil');
}

if (env.eslint === 'on') {
	if (!fs.existsSync('./node_modules/eslint')) {
		console.log('Missing module: eslint');
	}
}
else {
	console.log('Disabled module: eslint');
}

if (env.moment === 'on') {
	if (!fs.existsSync('./node_modules/moment')) {
		console.log('Missing module: moment');
	}
}
else {
	console.log('Disabled module: moment');
}

if (env.random_animals === 'on') {
	if (!fs.existsSync('./node_modules/random-animals')) {
		console.log('Missing module: random-animals');
	}
}
else {
	console.log('Disabled module: random-animals');
}

if (env.node_fetch === 'on') {
	if (!fs.existsSync('./node_modules/node-fetch')) {
		console.log('Missing module: node-fetch');
	}
}
else {
	console.log('Disabled module: node-fetch');
}

if (env.sequelize === 'on') {
	if (!fs.existsSync('./node_modules/sequelize')) {
		console.log('Missing module: sequelize');
	}
}
else {
	console.log('Disabled module: sequelize');
}

if (env.sqlite3 === 'on') {
	if (!fs.existsSync('./node_modules/sqlite3')) {
		console.log('Missing module: sqlite3');
	}
}
else {
	console.log('Disabled module: sqlite3');
}

if (env.tmi_js === 'on') {
	if (!fs.existsSync('./node_modules/tmi.js')) {
		console.log('Missing module: tmi.js');
	}
}
else {
	console.log('Disabled module: tmi.js');
}

if (env.utf_8_validate === 'on') {
	if (!fs.existsSync('./node_modules/utf-8-validate')) {
		console.log('Missing module: utf-8-validate');
	}
}
else {
	console.log('Disabled module: utf-8-validate');
}

if (env.weather_js === 'on') {
	if (!fs.existsSync('./node_modules/weather-js')) {
		console.log('Missing module: weather-js');
	}
}
else {
	console.log('Disabled module: weather-js');
}

if (env.zlib_sync === 'on') {
	if (!fs.existsSync('./node_modules/zlib-sync')) {
		console.log('Missing module: zlib-sync');
	}
}
else {
	console.log('Disabled module: zlib-sync');
}

// Tables

if (env.tables === 'on') {
	if (fs.existsSync(`./${app.app[0].tablesjs}`)) {
		require(`../${app.app[0].tablesjs}`);
	}
	else {
		console.log('Missing file: tables.js');
	}
}
else {
	console.log('Disabled  file: tables.js');
}

// Time

if (env.time === 'on') {
	if (fs.existsSync(`./${app.Time[0].timejs}`)) {
		require(`../${app.Time[0].timejs}`);
	}
	else {
		console.log('Missing file: time.js');
	}
}
else {
	console.log('Disabled  file: time.js');
}

// Discord

if (env.discord === 'on') {
	if (fs.existsSync(`./${app.Discord[3].discordjs}`)) {
		require(`../${app.Discord[3].discordjs}`);
	}
	else {
		console.log('Missing file: discord.js');
	}
}
else {
	console.log('Disabled file: discord.js');
}

// Twitch

if (env.twitch === 'on') {
	if (fs.existsSync(`./${app.Twitch[3].twitchjs}`)) {
		require(`../${app.Twitch[3].twitchjs}`);
	}
	else {
		console.log('Missing file: twitch.js');
	}
}
else {
	console.log('Disabled file: twitch.js');
}
