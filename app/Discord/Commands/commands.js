const app = require('../../app.json');
const env = process.env;

// const randomAnimals = require('random-animals');
const fetch = require('node-fetch');
const fs = require('fs');

const tables = require(`../../../${app.app[0].tablesjs}`);

const { EmbedBuilder } = require('discord.js');

module.exports.msg = {
	Commands: async (msg) => {
		if (msg.author.bot || !msg.guild) return;

		if (!fs.existsSync(`./${app.Twitch[2].bearerjs}`)) return;
		if (!fs.existsSync(`./${app.Discord[2].serversjs}`)) return;

		const StripMenu = env.StripMenu;
		const DiscordGif = env.DiscordGif;
		const TwitchGif = env.TwitchGif;

		const lBearer = await tables.bearer.findOne({ where: { CodeName: 'Bearer' } });
		if (!lBearer) return;

		const options = {
			method: 'get',
			headers: {
				'Client-ID': `${env.ClientTwitchId}`,
				'Authorization': `${lBearer.AccessToken}`,
			},
		};

		const lServer = await tables.server.findOne({ where: { GuildId: `${msg.guild.id}` } });
		if (!lServer) return;

		const myPref = `${lServer.GuildPrefix}`;
		const myLang = `${lServer.GuildLanguage}`;

		if (!msg.content.startsWith(myPref)) return;
		const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		/* if (command === 'слово') {
      const EmbedUk = new EmbedBuilder()
        .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
        .setDescription('Discord Book')
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: 'Фільм «Слово»', value: 'Український фільм «Слово» отримав відзнаку кінофестивалю у Нью-Йорку https://www.youtube.com/watch?v=Tc1P89uEPq8 Короткометражний фільм «Слово» заснований на реальних подіях, що мали місце в Радянській Україні' },
        )
        .setFooter({ text: 'Наближаємо перемогу разом!', iconURL: 'https://cdn.discordapp.com/attachments/767517518998142976/1050601037725184071/ua.gif' });

      msg.channel.send({ embeds: [EmbedUk] });
    } */

		if (command === 'job') {
			msg.delete();
			msg.channel.send({
				files: ['https://cdn.discordapp.com/attachments/982067662584709160/1188842382721032262/The_Punishers_Job.mp4'],
			});
		}

		if (command === 'дрони' || command === 'drones') {
			msg.reply('### [ПТАХИ МАДЯРА](<https://send.monobank.ua/jar/7UsDUH6np1>)\n### [АРМІЯ ДРОНІВ](<https://deepstate.org.ua/drone-army>)\n### [РІЙ ПОМСТИ 2.0](<https://prytulafoundation.org/about/projects/actual/riy-pomsty-2>)\n### [RUSORIZ](<https://send.monobank.ua/jar/dzBdJ3737>)');
		}

		if (command === 'help' || command === 'поміч') {
			msg.reply({
				files: ['https://cdn.discordapp.com/attachments/982067662584709160/1081791132587020438/Administrator.mp4'],
			});
		}

		if (command === 'sleep' || command === 'спати') {
			msg.reply({
				files: ['https://cdn.discordapp.com/attachments/982067662584709160/1176960516187492422/Sleep.mp4'],
			});
		}

		if (command === 'oleh' || command === 'олег') {
			msg.reply({
				files: ['https://cdn.discordapp.com/attachments/984455596843601920/1116298306642001920/Oleh.mp3'],
			});
		}

		if (command === 'скиглики') {
			msg.reply({
				files: ['https://cdn.discordapp.com/attachments/982067662584709160/1182973847994122271/14fbf057cb8ae6dd.mp4'],
			});
		}

		if (command === 'ping' || command === 'пінг') {
			const EmbedEn = new EmbedBuilder()
				.setAuthor({ name: 'Discord', url: 'https://discord.com/' })
				.setDescription('Discord Ping')
				.addFields(
					{ name: '\u200B', value: `Ping: ${new Date().getTime() - msg.createdTimestamp}мс`, inline: true },
				)
				.setImage(StripMenu)
				.setFooter({ text: 'Discord', iconURL: DiscordGif });

			const EmbedUk = new EmbedBuilder()
				.setAuthor({ name: 'Discord', url: 'https://discord.com/' })
				.setDescription('Discord Ping')
				.addFields(
					{ name: '\u200B', value: `Ping: ${new Date().getTime() - msg.createdTimestamp}ms`, inline: true },
				)
				.setImage(StripMenu)
				.setFooter({ text: 'Discord', iconURL: DiscordGif });

			if (myLang === 'en') {
				msg.reply({ embeds: [EmbedEn] });
			}
			else if (myLang === 'uk') {
				msg.reply({ embeds: [EmbedUk] });
			}
		}

		/* if (command === 'cat' || command === 'кіт') {
      fetch('http://aws.random.cat/meow')
        .then(response => response.json())
        .then(async (data) => {
          msg.channel.send(`${data.file}`);
        })
        .catch(err => console.error(err));
    }

    if (command === 'dog' || command === 'пес') {
      randomAnimals.dog().then(dog => {
        msg.channel.send(dog);
      })
        .catch(err => console.error(err));
    } */

		if (command === 'topic' || command === 'тема') {
			const EmbedEn = new EmbedBuilder()
				.setAuthor({ name: 'Discord', url: 'https://discord.com/' })
				.setDescription('Discord Topic')
				.addFields(
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Topic', value: `${msg.channel.topic || 'The topic is missing.'}`, inline: true },
				)
				.setImage(StripMenu)
				.setFooter({ text: 'Discord', iconURL: DiscordGif });

			const EmbedUk = new EmbedBuilder()
				.setAuthor({ name: 'Discord', url: 'https://discord.com/' })
				.setDescription('Discord Topic')
				.addFields(
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Тема', value: `${msg.channel.topic || 'Тема відсутня.'}`, inline: true },
				)
				.setImage(StripMenu)
				.setFooter({ text: 'Discord', iconURL: DiscordGif });

			if (myLang === 'en') {
				msg.reply({ embeds: [EmbedEn] });
			}
			else if (myLang === 'uk') {
				msg.reply({ embeds: [EmbedUk] });
			}
		}

		if (command === 'twitch') {
			if (!args.length) {
				const EmbedEn = new EmbedBuilder()
					.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
					.setDescription('Twitch Channel')
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Warning!', value: 'Enter the name of the Twitch channel.', inline: true },
					)
					.setImage(StripMenu)
					.setFooter({ text: 'Twitch', iconURL: TwitchGif });

				const EmbedUk = new EmbedBuilder()
					.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
					.setDescription('Twitch Channel')
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Увага!', value: 'Вкажіть ім\'я каналу Twitch.', inline: true },
					)
					.setImage(StripMenu)
					.setFooter({ text: 'Twitch', iconURL: TwitchGif });

				if (myLang === 'en') {
					return msg.channel.send({ embeds: [EmbedEn] });
				}
				else if (myLang === 'uk') {
					return msg.channel.send({ embeds: [EmbedUk] });
				}
			}

			fetch(`${env.UserLogin}${args[0]}`, options)
				.then(response => response.json())
				.then(async User => {

					if (!User.data[0]) {
						const EmbedEn = new EmbedBuilder()
							.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
							.setDescription('Twitch Channel')
							.addFields(
								{ name: '\u200B', value: '\u200B' },
								{ name: 'Warning!', value: `Twitch channel **${args[0]}** not found.\nMake sure you enter the name correctly.`, inline: true },
							)
							.setImage(StripMenu)
							.setFooter({ text: 'Twitch', iconURL: TwitchGif });

						const EmbedUk = new EmbedBuilder()
							.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
							.setDescription('Twitch Channel')
							.addFields(
								{ name: '\u200B', value: '\u200B' },
								{ name: 'Увага!', value: `Канал Twitch **${args[0]}** не знайдений.\nПеревірте, чи правильно ви вказали ім'я.`, inline: true },
							)
							.setImage(StripMenu)
							.setFooter({ text: 'Twitch', iconURL: TwitchGif });

						if (myLang === 'en') {
							return msg.channel.send({ embeds: [EmbedEn] });
						}
						else if (myLang === 'uk') {
							return msg.channel.send({ embeds: [EmbedUk] });
						}
					}

					fetch(`${env.StreamUserLogin}${args[0]}`, options)
						.then(response => response.json())
						.then(async Stream => {

							if (!Stream.data[0]) {
								const EmbedEn = new EmbedBuilder()
									.setAuthor({ name: `${User.data[0].display_name}`, url: `https://www.twitch.tv/${User.data[0].login}` })
									.setDescription('Twitch Channel')
									.setThumbnail(`${User.data[0].profile_image_url}`)
									.addFields(
										{ name: '\u200B', value: '\u200B' },
										{ name: 'Status', value: 'Offline', inline: true },
										{ name: 'Category', value: '0', inline: true },
										{ name: 'Category ID', value: '0', inline: true },
										{ name: 'Channel ID', value: `||${User.data[0].id || '0'}||`, inline: true },
										{ name: 'Staff / Admin', value: `${User.data[0].type || '0'}`, inline: true },
										{ name: 'Partner / Affiliate', value: `${User.data[0].broadcaster_type || '0'}`, inline: true },
										{ name: 'View Count', value: `${User.data[0].view_count || '0'}`, inline: true },
										{ name: 'Viewer Count', value: '0', inline: true },
										{ name: 'Language', value: '0', inline: true },
									)
									.setImage(`${User.data[0].offline_image_url}` || env.TwitchPng)
									.setFooter({ text: 'Twitch', iconURL: TwitchGif });
								return msg.channel.send({ embeds: [EmbedEn] });
							}

							const d = new Date(Stream.data[0].started_at);
							const d2 = new Date();
							const d3 = d2 - d;
							const y2 = Math.floor((d3 / (1000 * 60 * 60 * 24)) % 60).toString();
							const y3 = Math.floor((d3 / (1000 * 60 * 60)) % 60).toString();
							const y4 = Math.floor((d3 / (1000 * 60)) % 60).toString();

							fetch(`${env.GameId}${Stream.data[0].game_id}`, options)
								.then(response => response.json())
								.then(async Game => {

									if (!Game.data[0]) {
										const EmbedEn = new EmbedBuilder()
											.setAuthor({ name: `${User.data[0].display_name}`, url: `https://www.twitch.tv/${User.data[0].login}` })
											.setDescription(`Twitch Channel\n\n${Stream.data[0].title || '0'}`)
											.setThumbnail(`${User.data[0].profile_image_url}`)
											.addFields(
												{ name: '\u200B', value: '\u200B' },
												{ name: 'Status', value: 'Online', inline: true },
												{ name: 'Category', value: `${Game.data[0].name || '0'}`, inline: true },
												{ name: 'Category ID', value: `${Stream.data[0].id || '0'}`, inline: true },
												{ name: 'Channel ID', value: `||${User.data[0].id || '0'}||`, inline: true },
												{ name: 'Staff / Admin', value: `${User.data[0].type || '0'}`, inline: true },
												{ name: 'Partner / Affiliate', value: `${User.data[0].broadcaster_type || '0'}`, inline: true },
												{ name: 'View Count', value: `${User.data[0].view_count || '0'}`, inline: true },
												{ name: 'Viewer Count', value: `${Stream.data[0].viewer_count || '0'}`, inline: true },
												{ name: 'Language', value: `${Stream.data[0].language || '0'}`, inline: true },
											)
											.setImage(`${Game.data[0].box_art_url.replace(/{width}/g, '300').replace(/{height}/g, '400')}`)
											.setFooter({ text: 'Twitch', iconURL: TwitchGif });
										return msg.channel.send({ embeds: [EmbedEn] });
									}
									else {
										const EmbedEn = new EmbedBuilder()
											.setAuthor({ name: `${User.data[0].display_name}`, url: `https://www.twitch.tv/${User.data[0].login}` })
											.setTitle(`${Game.data[0].name}`)
											.setURL(`https://www.twitch.tv/directory/game/${Game.data[0].name.replace(/ /g, '%20').toLowerCase() || '0'}`)
											.setDescription(`Twitch Channel\n\n${Stream.data[0].title || '0'}`)
											.setThumbnail(`${User.data[0].profile_image_url}`)
											.addFields(
												{ name: '\u200B', value: '\u200B' },
												{ name: 'Status', value: 'Online', inline: true },
												{ name: 'Category', value: `${Game.data[0].name || '0'}`, inline: true },
												{ name: 'Category ID', value: `${Stream.data[0].id || '0'}`, inline: true },
												{ name: 'Channel ID', value: `||${User.data[0].id || '0'}||`, inline: true },
												{ name: 'Staff / Admin', value: `${User.data[0].type || '0'}`, inline: true },
												{ name: 'Partner / Affiliate', value: `${User.data[0].broadcaster_type || '0'}`, inline: true },
												{ name: 'View Count', value: `${User.data[0].view_count || '0'}`, inline: true },
												{ name: 'Viewer Count', value: `${Stream.data[0].viewer_count || '0'}`, inline: true },
												{ name: 'Language', value: `${Stream.data[0].language || '0'}`, inline: true },
												{ name: 'Uptime', value: `${y2} / ${y3}:${y4}`, inline: true },
											)
											.setImage(`${Game.data[0].box_art_url.replace(/{width}/g, '300').replace(/{height}/g, '400')}`)
											.setFooter({ text: 'Twitch', iconURL: TwitchGif });
										msg.channel.send({ embeds: [EmbedEn] });
									}
								})
								.catch(err => console.error(err));
						})
						.catch(err => console.error(err));
				})
				.catch(err => console.error(err));
		}
	},
};
