console.log('Running file: twitch.js');

const tmi = require('tmi.js');
const fs = require('fs');

const app = require('../app.json');
const env = process.env;

const tables = require(`../../${app.app[0].tablesjs}`);

let channelNames = [];

async function getChannelNames() {
	async function safeDBQuery(query) {
		try {
			return await query();
		}
		catch (error) {
			console.error('Помилка бази даних:', error);
			return null;
		}
	}

	await safeDBQuery(() => tables.channel.sync());

	const oneClient = await safeDBQuery(() => tables.channel.findOne({ where: {
		ChannelName: `#${env.ClientTwitchName}`,
	} }));

	if (!oneClient) {
		await safeDBQuery(() => tables.channel.create({
			CodeName: 'Channel',
			ChannelName: `#${env.ClientTwitchName}`,
			ChannelPrefix: `${env.ClientTwitchPrefix}`,
			ChannelLanguage: 'en',
		}));
	}

	const allChannels = await safeDBQuery(() => tables.channel.findAll({ attributes: ['ChannelName'], where: { CodeName: 'Channel' } }));
	channelNames = allChannels.map(item => item.ChannelName);
}

getChannelNames().then(() => {
	const client = new tmi.Client({
		options: { debug: false },
		connection: {
			secure: true,
			reconnect: true,
		},
		identity: {
			username: `${env.ClientTwitchName}`,
			password: `${env.ClientTwitchOauth}`,
		},
		channels: channelNames,
	});

	client.connect();

	module.exports = { client };

	client.on('connected', () => {
		console.log(`Client Twitch Ready: ${client.getUsername()}`);

		const Channels = client.opts.channels;
		console.log('Client Twitch Channels:', Channels);
	});

	client.on('join', (channel, username, self) => {
		if (self) {
			console.log('Client Twitch Join:', channel);
		}
	});

	client.on('logon', async () => {
		// System

		if (env.bearer === 'on') {
			if (fs.existsSync(`./${app.Twitch[2].bearerjs}`)) {
				require(`../../${app.Twitch[2].bearerjs}`);
			}
		}

		if (env.category === 'on') {
			if (fs.existsSync(`./${app.Twitch[2].categoryjs}`)) {
				const category = require(`../../${app.Twitch[2].categoryjs}`);
				category.logon.Category();
			}
		}
	});


	client.on('chat', (channel, userstate, message, self) => {
		if (self) return;

		// Events

		if (env.chat === 'on') {
			if (fs.existsSync(`./${app.Twitch[1].chatjs}`)) {
				const chat = require(`../../${app.Twitch[1].chatjs}`);
				chat.chat.Chat(channel, userstate, message, self);
			}
		}
	});


	client.on('message', (channel, userstate, message, self) => {
		if (self) return;

		const owner = `${userstate.username}` === `${env.OwnerTwitchName}`;
		const broadcaster = userstate.username === channel.replace('#', '');
		const moderator = userstate['user-type'] === 'mod';

		// Commands

		if (env.commands === 'on') {
			if (fs.existsSync(`./${app.Twitch[0].commandsjs}`)) {
				const commands = require(`../../${app.Twitch[0].commandsjs}`);
				commands.msg.Commands(channel, userstate, message, self);
			}
		}

		if (env.quote === 'on') {
			if (fs.existsSync(`./${app.Twitch[0].quotejs}`)) {
				const quote = require(`../../${app.Twitch[0].quotejs}`);
				quote.msg.Quote(channel, userstate, message, self);
			}
		}

		if (env.speak === 'on') {
			if (fs.existsSync(`./${app.Twitch[0].speakjs}`)) {
				const speak = require(`../../${app.Twitch[0].speakjs}`);
				speak.msg.Speak(channel, userstate, message, self);
			}
		}

		// System

		if (owner || broadcaster || moderator) {
			if (env.category === 'on') {
				if (fs.existsSync(`./${app.Twitch[2].categoryjs}`)) {
					const category = require(`../../${app.Twitch[2].categoryjs}`);
					category.msg.Category(channel, userstate, message, self);
				}
			}
		}

		if (env.channels === 'on') {
			if (fs.existsSync(`./${app.Twitch[2].channelsjs}`)) {
				const channels = require(`../../${app.Twitch[2].channelsjs}`);
				channels.msg.Channels(channel, userstate, message, self);
			}
		}

		if (env.words === 'on') {
			if (fs.existsSync(`./${app.Twitch[2].wordsjs}`)) {
				const words = require(`../../${app.Twitch[2].wordsjs}`);
				words.msg.Words(channel, userstate, message, self);
			}
		}
	});
});
