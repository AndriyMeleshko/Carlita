console.log('Running file: bearer.js');

const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

const app = require('../../app.json');
const env = process.env;

const tables = require(`../../../${app.app[0].tablesjs}`);

const { EmbedBuilder } = require('discord.js');

setInterval(async () => {
	if (!fs.existsSync(`./${app.Time[0].timesq}`)) return;
	if (!fs.existsSync(`./${app.Twitch[2].bearersq}`)) return;

	const lTime = await tables.time.findOne({ where: { CodeName: 'Time' } });

	if (!lTime) return;

	const lBearer = await tables.bearer.findOne({ where: { CodeName: 'Bearer' } });

	if (!lBearer) {

		fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.ClientTwitchId}&client_secret=${env.ClientTwitchSecret}&grant_type=client_credentials`, {
			method: 'post',
		})
			.then(response => response.json())
			.then(async BearerPost => {

				const create = await tables.bearer.create({
					CodeName: 'Bearer',
					TimePlus: `${moment().utc().locale('en').add(2, 'M').format()}`,
					TimePlus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
					AccessToken: `Bearer ${BearerPost.access_token}`,
					RefreshToken: `${BearerPost.refresh_token}`,
					ExpiresIn: `${BearerPost.expires_in}`,
					Scope: `${BearerPost.scope}`,
					TokenType: `${BearerPost.token_type}`,
				});

				if (create) {
					console.log('Bearer: Created');
				}
			})
			.catch(err => console.error(err));
	}
	else

		if (lBearer) {

			const timeReal = `${moment().utc().locale('en').format()}`;
			const timePlus = `${lBearer.TimePlus}`;

			if (!timePlus) return;

			if (timeReal > timePlus) {

				fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.ClientTwitchId}&client_secret=${env.ClientTwitchSecret}&grant_type=client_credentials`, {
					method: 'post',
				})
					.then(response => response.json())
					.then(async BearerPost => {

						const update = await tables.bearer.update({
							TimePlus: `${moment().utc().locale('en').add(2, 'M').format()}`,
							TimePlus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
							AccessToken: `Bearer ${BearerPost.access_token}`,
							RefreshToken: `${BearerPost.refresh_token}`,
							ExpiresIn: `${BearerPost.expires_in}`,
							Scope: `${BearerPost.scope}`,
							TokenType: `${BearerPost.token_type}`,
						}, {
							where: {
								CodeName: 'Bearer',
							} });

						if (update) {
							console.log('Bearer: Updated');
						}
					})
					.catch(err => console.error(err));
			}
		}
}, 60 * 1000);

module.exports.msg = {
	Bearer: async (msg) => {
		if (msg.author.bot) return;

		if (!fs.existsSync(`./${app.Time[0].timesq}`)) return;
		if (!fs.existsSync(`./${app.Twitch[2].bearersq}`)) return;
		if (!fs.existsSync(`./${app.Discord[2].serverssq}`)) return;

		const lTime = await tables.time.findOne({ where: { CodeName: 'Time' } });

		if (!lTime) return;

		const lServer = await tables.server.findOne({
			where: { GuildId: `${msg.guild.id}` } });

		if (!lServer) return;

		const myPref = `${lServer.GuildPrefix}`;
		const myLang = `${lServer.GuildLanguage}`;

		if (!msg.content.startsWith(myPref)) return;
		const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		const Strip = env.StripMenu;
		const Gif = env.TwitchGif;

		const Author = { name: 'Twitch', url: 'https://www.twitch.tv/' };
		const Description = 'Twitch Bearer';
		const Image = Strip;
		const Footer = { text: 'Twitch', iconURL: Gif };

		if (command === 'bearer') {

			if (!args.length) {

				const EmbedEn = new EmbedBuilder()
					.setAuthor(Author)
					.setDescription(Description)
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Options', value: `${myPref}${command} add create / list`, inline: true },
					)
					.setImage(Image)
					.setFooter(Footer);

				const EmbedUk = new EmbedBuilder()
					.setAuthor(Author)
					.setDescription(Description)
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Options', value: `${myPref}${command} add create / list`, inline: true },
					)
					.setImage(Image)
					.setFooter(Footer);

				switch (myLang) {
				case 'en':
					return msg.channel.send({ embeds: [EmbedEn] });
				case 'uk':
					return msg.channel.send({ embeds: [EmbedUk] });
				}
			}

			if (args[0] === 'create' || args[0] === 'c') {

				fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.ClientTwitchId}&client_secret=${env.ClientTwitchSecret}&grant_type=client_credentials`, {
					method: 'post',
				})
					.then(response => response.json())
					.then(async BearerPost => {

						const lBearer = await tables.bearer.findOne({ where: {
							CodeName: 'Bearer',
						} });

						if (!lBearer) {

							const create = await tables.bearer.create({
								CodeName: 'Bearer',
								TimePlus: `${moment().utc().locale('en').add(2, 'M').format()}`,
								TimePlus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
								AccessToken: `Bearer ${BearerPost.access_token}`,
								RefreshToken: `${BearerPost.refresh_token}`,
								ExpiresIn: `${BearerPost.expires_in}`,
								Scope: `${BearerPost.scope}`,
								TokenType: `${BearerPost.token_type}`,
							});

							if (create) {
								console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Bearer: Created`);

								const EmbedEn = new EmbedBuilder()
									.setAuthor(Author)
									.setDescription(Description)
									.addFields(
										{ name: '\u200B', value: '\u200B' },
										{ name: 'Good', value: `New Bearer: ${create.RefreshToken}`, inline: false },
									)
									.setImage(Image)
									.setFooter(Footer);

								const EmbedUk = new EmbedBuilder()
									.setAuthor(Author)
									.setDescription(Description)
									.addFields(
										{ name: '\u200B', value: '\u200B' },
										{ name: 'Добре', value: `Новий Bearer: ${create.RefreshToken}`, inline: false },
									)
									.setImage(Image)
									.setFooter(Footer);

								switch (myLang) {
								case 'en':
									msg.channel.send({ embeds: [EmbedEn] });
									break;
								case 'uk':
									msg.channel.send({ embeds: [EmbedUk] });
									break;
								}
							}
						}
						else

							if (lBearer) {
								const update = await tables.bearer.update({
									TimePlus: `${moment().utc().locale('en').add(2, 'M').format()}`,
									TimePlus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
									AccessToken: `Bearer ${BearerPost.access_token}`,
									RefreshToken: `${BearerPost.refresh_token}`,
									ExpiresIn: `${BearerPost.expires_in}`,
									Scope: `${BearerPost.scope}`,
									TokenType: `${BearerPost.token_type}`,
								}, {
									where: {
										CodeName: 'Bearer',
									} });

								if (update) {
									console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Bearer: Updated`);
								}
							}
					})
					.catch(err => console.error(err));
			}

			if (args[0] === 'list' || args[0] === 'l') {

				const lBearers = await tables.bearer.findAll({ attributes: [
					'CodeName',
					'TimePlus',
					'TimePlus2',
					'AccessToken',
					'RefreshToken',
					'ExpiresIn',
					'Scope',
					'TokenType',
				], where: { CodeName: 'Bearer' } });

				const CodeName = lBearers.map(t => t.CodeName).join('\n') || '0';
				const TimePlus = lBearers.map(t => t.TimePlus).join('\n') || '0';
				const TimePlus2 = lBearers.map(t => t.TimePlus2).join('\n') || '0';
				const AccessToken = lBearers.map(t => t.AccessToken).join('\n') || '0';
				const RefreshToken = lBearers.map(t => t.RefreshToken).join('\n') || '0';
				const ExpiresIn = lBearers.map(t => t.ExpiresIn).join('\n') || '0';
				const Scope = lBearers.map(t => t.Scope).join('\n') || '0';
				const TokenType = lBearers.map(t => t.TokenType).join('\n') || '0';

				const EmbedEn = new EmbedBuilder()
					.setAuthor(Author)
					.setDescription(Description)
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Name', value: `${CodeName}`, inline: true },
						{ name: 'Date of next update', value: `${TimePlus}\n${TimePlus2}`, inline: true },
						{ name: 'Access Token', value: `${AccessToken}`, inline: false },
						{ name: 'Refresh Token', value: `${RefreshToken}`, inline: true },
						{ name: 'Expires In', value: `${ExpiresIn}`, inline: true },
						{ name: 'Scope', value: `${Scope}`, inline: true },
						{ name: 'Token Type', value: `${TokenType}`, inline: true },
					)
					.setImage(Image)
					.setFooter(Footer);

				const EmbedUk = new EmbedBuilder()
					.setAuthor(Author)
					.setDescription(Description)
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Ім\'я', value: `${CodeName}`, inline: true },
						{ name: 'Дата наступного оновлення', value: `${TimePlus}\n${TimePlus2}`, inline: true },
						{ name: 'Access Token', value: `${AccessToken}`, inline: false },
						{ name: 'Refresh Token', value: `${RefreshToken}`, inline: true },
						{ name: 'Expires In', value: `${ExpiresIn}`, inline: true },
						{ name: 'Scope', value: `${Scope}`, inline: true },
						{ name: 'Token Type', value: `${TokenType}`, inline: true },
					)
					.setImage(Image)
					.setFooter(Footer);


				switch (myLang) {
				case 'en':
					msg.channel.send({ embeds: [EmbedEn] });
					break;
				case 'uk':
					msg.channel.send({ embeds: [EmbedUk] });
					break;
				}
			}

			if (args[0] === 'delete' || args[0] === 'del' || args[0] === 'd') {
				await tables.bearer.destroy({ where: {
					// GuildId: `${msg.guild.id}`,
				} });
			}
		}
	},
};


module.exports.chat = {
	Bearer: async (channel, userstate, message, self) => {

		if (self) return;

		const ClientTwitch = require(`../../../${app.Twitch[3].twitchjs}`);
		const tChannel = require(`../../../${app.Twitch[2].channelsjs}`);

		const lChannel = await tChannel.Channel.findOne({ where: { ChannelName: `${channel}` } });

		const myPref = `${lChannel.ChannelPrefix}`;
		const myLang = `${lChannel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		if (command === 'bearer') {

			if (!args.length) {

				switch (myLang) {
				case 'en':
					ClientTwitch.client.say(channel, '/me Specify: create • list • delete');
					break;
				case 'uk':
					ClientTwitch.client.say(channel, '/me Вкажіть: create • list • delete');
					break;
				}
			}

			if (args[0] === 'create' || args[0] === 'c') {

				switch (myLang) {
				case 'en':
					ClientTwitch.client.say(channel, '/me 3');
					break;
				case 'uk':
					ClientTwitch.client.say(channel, '/me 4');
					break;
				}
			}

			if (args[0] === 'list' || args[0] === 'l') {

				switch (myLang) {
				case 'en':
					ClientTwitch.client.say(channel, '/me 3');
					break;
				case 'uk':
					ClientTwitch.client.say(channel, '/me 4');
					break;
				}
			}

			if (args[0] === 'delete' || args[0] === 'del' || args[0] === 'd') {

				switch (myLang) {
				case 'en':
					ClientTwitch.client.say(channel, '/me 3');
					break;
				case 'uk':
					ClientTwitch.client.say(channel, '/me 4');
					break;
				}
			}
		}
	},
};
