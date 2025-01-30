const { Op } = require('sequelize');

const app = require('../../app.json');
const env = process.env;

const Twitch = require(`../../../${app.Twitch[3].twitchjs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

module.exports.msg = {
	Channels: async (channel, userstate, message, self) => {
		if (self) return;

		const lChannel = await tables.channel.findOne({ where: { ChannelName: `${channel}` } });
		if (!lChannel) return;

		const myPref = `${lChannel.ChannelPrefix}`;
		const myLang = `${lChannel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		if (command === 'join') {
			if (channel !== `${env.ClientTwitchChannel}`) return;
			// if (userstate.username !== `${env.OwnerTwitchName}`) return;

			if (!args[0]) {
				const lJoin = await tables.channel.findOne({ where: {
					ChannelName: `#${userstate.username}`,
				} });

				if (lJoin) {
					switch (myLang) {
					case 'en':
						return Twitch.client.say(channel, '/me I\'m already in your channel');

					case 'uk':
						return Twitch.client.say(channel, '/me Я вже присутня у вашому каналі');
					}
				}
				else if (!lJoin) {
					const create = await tables.channel.create({
						CodeName: 'Channel',
						ChannelName: `#${userstate.username}`,
						ChannelPrefix: `${env.ClientTwitchPrefix}`,
						ChannelLanguage: 'en',
					});
					if (create) {
						Twitch.client.join(`${create.ChannelName}`)
							.then((data) => {
								console.log(`Twitch Channel | Created: ${data} / Prefix: ${create.ChannelPrefix} / Language: ${create.ChannelLanguage}`);

								switch (myLang) {
								case 'en':
									Twitch.client.say(channel, '/me I joined your channel');
									break;

								case 'uk':
									Twitch.client.say(channel, '/me Я приєдналася до вашого каналу');
									break;
								}
							})
							.catch(err => console.error('Помилка приєднання до каналу:', err));
					}
				}
			}
			else if (args[0] === 'list') {
				if (userstate.username !== `${env.OwnerTwitchName}`) return;

				const lJoins = await tables.channel.findAll({ attributes: ['ChannelName'] });
				const ChannelName = lJoins.map(item => item.ChannelName).join(', ') || '0';

				switch (myLang) {
				case 'en':
					Twitch.client.say(channel, `/me ${ChannelName}`);
					break;

				case 'uk':
					Twitch.client.say(channel, `/me ${ChannelName}`);
					break;
				}
			}
			else if (args[0] === 'del') {
				if (channel !== `${env.ClientTwitchChannel}`) return;
				if (userstate.username !== `${env.OwnerTwitchName}`) return;

				const destroy = await tables.channel.destroy({ where: {
					ChannelName: { [Op.ne]: `${env.ClientTwitchChannel}` },
				} });

				if (destroy) {
					switch (myLang) {
					case 'en':
						Twitch.client.say(channel, '/me The list of all channels has been deleted');
						break;

					case 'uk':
						Twitch.client.say(channel, '/me Список усіх каналів видалений');
						break;
					}
				}
				else if (!destroy) {
					switch (myLang) {
					case 'en':
						Twitch.client.say(channel, '/me There is no channel list');
						break;

					case 'uk':
						Twitch.client.say(channel, '/me Список каналів відсутній');
						break;
					}
				}
			}
		}

		if (command === 'part') {
			if (channel !== `${env.ClientTwitchChannel}`) return;
			// if (userstate.username !== `${env.OwnerTwitchName}`) return;

			const lPart = await tables.channel.findOne({ where: {
				ChannelName: `#${userstate.username}`,
			} });

			if (!lPart) {
				switch (myLang) {
				case 'en':
					return Twitch.client.say(channel, '/me I\'m not in your channel');

				case 'uk':
					return Twitch.client.say(channel, '/me Мене немає у вашому каналі');
				}
			}
			else if (lPart) {
				const destroy = await tables.channel.destroy({ where: {
					ChannelName: `#${userstate.username}`,
				} });
				if (destroy) {
					Twitch.client.part(`${userstate.username}`)
						.then((data) => {
							console.log(`Twitch Channel | Remove: ${data}`);

							switch (myLang) {
							case 'en':
								Twitch.client.say(channel, '/me I left your channel');
								break;
							case 'uk':
								Twitch.client.say(channel, '/me Я залишила ваш канал');
								break;
							}
						})
						.catch(err => console.error('Помилка від\'єднання від каналу:', err));
				}
			}
		}

		if (command === 'language' || command === 'lang' || command === 'мова') {
			const broadcaster = userstate.badges['broadcaster'];
			const moderator = userstate.badges['moderator'];

			if (broadcaster || moderator) {

				// if (userstate['user-type'] !== 'mod') return;
				// if (userstate.username !== `${env.OwnerTwitchName}`) return;

				if (!args.length) {
					switch (myLang) {
					case 'en':
						Twitch.client.say(channel, `/me Language: English / Change: ${myPref}language uk / sp`);
						break;
					case 'uk':
						Twitch.client.say(channel, `/me Мова: Українська / Змінити: ${myPref}мова en / sp`);
						break;
					}
					return;
				}

				if (args[0] === 'en') {
					switch (myLang) {
					case 'en':
						Twitch.client.say(channel, '/me I already speak English');
						break;
					case 'uk': {
						const update = await tables.channel.update({
							ChannelLanguage: 'en',
						}, { where: {
							CodeName: 'Channel',
							ChannelName: `${channel}`,
						} });
						if (update) {
							Twitch.client.say(channel, '/me Now I communicate in English');
						}
					}
						break;
					}
				}
				else if (args[0] === 'uk') {
					switch (myLang) {
					case 'uk':
						Twitch.client.say(channel, '/me Я вже говорю українською');
						break;

					case 'en': {
						const update = await tables.channel.update({
							ChannelLanguage: 'uk',
						}, { where: {
							CodeName: 'Channel',
							ChannelName: `${channel}`,
						} });
						if (update) {
							Twitch.client.say(channel, '/me Тепер я спілкуюся українською');
						}
					}
						break;
					}
				}
				else if (args[0] === 'sp') {
					switch (myLang) {
					case 'en':
						Twitch.client.say(channel, '/me Sorry, but Spanish is not available');
						break;

					case 'uk':
						Twitch.client.say(channel, '/me Вибачте, але іспанська мова відсутня');
						break;
					}
				}
			}
		}
	},
};
