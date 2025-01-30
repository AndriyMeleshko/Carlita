console.log('Running file: live.js');

const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

const app = require('../../app.json');
const env = process.env;

const tables = require(`../../../${app.app[0].tablesjs}`);

const { EmbedBuilder } = require('discord.js');

async function safeDBQuery(query) {
	try {
		return await query();
	}
	catch (error) {
		console.error('File: live.js / Помилка бази даних:', error);
		return null;
	}
}

module.exports.ready = {
	Live: async (ClientDiscord) => {
		const Bearer = await safeDBQuery(() => tables.bearer.findOne({
			where: { CodeName: 'Bearer' } }));

		const options = {
			method: 'get',
			headers: {
				'Client-ID': `${env.ClientTwitchId}`,
				'Authorization': `${Bearer.AccessToken}`,
			},
		};

		let timer_stream;

		function stopTimerStream() {
			clearTimeout(timer_stream);
		}

		startTimerStream();

		function startTimerStream() {
			timer_stream = setTimeout(TimerStream, 1 * 1000);
		}

		let timer_message;

		startTimerMsg();

		function startTimerMsg() {
			timer_message = setTimeout(TimerMsg, 1 * 1000);
		}

		function stopTimerMsg() {
			clearTimeout(timer_message);
		}

		let timer_message_delay;

		function stopTimerMsgDelay() {
			clearTimeout(timer_message_delay);
		}

		async function TimerStream() {
			if (!fs.existsSync(`${app.Twitch[2].bearersq}`)) return stopTimerStream(), startTimerStream();

			if (!fs.existsSync(`${app.Twitch[0].livesq}`)) return stopTimerStream(), startTimerStream();

			const UserLogin = await safeDBQuery(() => tables.live.findAll({
				attributes: ['UserLogin'],
				where: { CodeName: 'User' } }));

			const lUsersLogin = UserLogin.map(item => item.UserLogin).join('&user_login=');
			if (!`${lUsersLogin}`) return stopTimerStream(), startTimerStream();

			const response = await fetch(`${env.StreamUserLogin}${lUsersLogin}`, options);
			const data = await response.json();

			// Перевірка наявності даних
			const UserLiveSet = data && data.data && data.data.length > 0
				? new Set(data.data.map(item => item.user_login))
				: new Set();

			const UserDataSet = new Set(UserLogin.map(item => item.UserLogin));
			const Offline = [...UserLiveSet].filter(user => !UserDataSet.has(user))
				.concat([...UserDataSet].filter(user => !UserLiveSet.has(user)));

			// Перевірка наявності офлайн користувачів перед виконанням запитів до БД
			if (Offline.length > 0) {
				// Виконання запитів до БД тільки якщо є офлайн користувачі
				const UsersOffline = await safeDBQuery(() => tables.live.findAll({
					attributes: ['UserLogin'],
					where: { CodeName: 'Stream', UserLogin: Offline, Type: 'live' } }));

				if (UsersOffline.length > 0) {
					setTimeout(async () => {
						const lUsersOffline = UsersOffline.map(item => item.UserLogin);
						const update1 = await safeDBQuery(() => tables.live.update({
							Type: '0',
							History: '0',
							GameName: '1',
						}, { where: { CodeName: 'Stream', UserLogin: Offline } }));

						if (update1) {
							const update2 = await safeDBQuery(() => tables.live.update({
								MessageId: '0',
							}, { where: { CodeName: 'User', UserLogin: lUsersOffline.join(',') } }));

							if (update2) {
								console.log(`Stream Offline: ${lUsersOffline}`);
							}
						}
					}, 1 * 60 * 1000);
				}
			}
			// else {
			// Якщо офлайн користувачі відсутні, можна виконати інші дії або просто продовжити виконання коду
			// }

			const Online = data.data.map(item => item.user_login);

			// console.log('Online', Online);
			// console.log('Offline', Offline);

			if (Online.length > 0) {
				let Delay = 0;

				data.data.forEach((person, index) => {
					setTimeout(async () => {
						// Якщо в базі даних GameName має інше значення ніж запит game_name
						const GameName = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'Stream',
								UserLogin: `${person.user_login}`,
								GameName: `${person.game_name || 0}`,
							} }));

						const FirstUpdate = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'Stream',
								UserLogin: `${person.user_login}`,
								GameName: '1',
							} }));

						// Якщо в базі даних Send1 має значення 1
						const SendOne = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'User',
								Send: '1',
							} }));

						if (!GameName) {
							if (FirstUpdate) {
								if (SendOne) return;

								await safeDBQuery(() => tables.live.update({
									Send: '1',
								}, { where: {
									CodeName: 'User',
									UserLogin: `${person.user_login}`,
								} }));

								const update = await safeDBQuery(() => tables.live.update({
									History: `${person.game_name || 0}`,
									GameId: `${person.game_id || 0}`,
									GameName: `${person.game_name || 0}`,
									Type: `${person.type}`,
									Title: `${person.title}`,
									Tags: `${person.tags || 0}`,
									ViewerCount: `${person.viewer_count}`,
									StartedAt: `${person.started_at}`,
									Language: `${person.language}`,
									ThumbnailUrl: `${person.thumbnail_url}`,
									IsMature:`${person.is_mature}`,
								}, { where: {
									CodeName: 'Stream',
									UserLogin: `${person.user_login}`,
								} }));

								if (update) {
									console.log(`Data Update No Game 1 / ${person.user_login}`);
								}
							}
							else {
								// В базі є гра
								const UserHistory = await safeDBQuery(() => tables.live.findOne({
									where: {
										CodeName: 'Stream',
										UserLogin: `${person.user_login}`,
									} }));

								await safeDBQuery(() => tables.live.update({
									Update: '1',
								}, { where: {
									CodeName: 'User',
									UserLogin: `${person.user_login}`,
								} }));

								if (UserHistory.History.length < '200') {
									const update = await safeDBQuery(() => tables.live.update({
										History: `${UserHistory.History.concat(`,${person.game_name || 0}`)}`,
										GameId: `${person.game_id || 0}`,
										GameName: `${person.game_name || 0}`,
										Type: `${person.type}`,
										Title: `${person.title}`,
										Tags: `${person.tags || 0}`,
										ViewerCount: `${person.viewer_count}`,
										StartedAt: `${person.started_at}`,
										Language: `${person.language}`,
										ThumbnailUrl: `${person.thumbnail_url}`,
										IsMature:`${person.is_mature}`,
									}, { where: {
										CodeName: 'Stream',
										UserLogin: `${person.user_login}`,
									} }));

									if (update) {
										console.log(`Data Update 2 / ${person.user_login}`);
									}
								}
								else if (UserHistory.History.length > '200') {
									if (UserHistory.History.endsWith(',.')) {
										const update = await safeDBQuery(() => tables.live.update({
											GameId: `${person.game_id || 0}`,
											GameName: `${person.game_name || 0}`,
											Type: `${person.type}`,
											Title: `${person.title}`,
											Tags: `${person.tags || 0}`,
											ViewerCount: `${person.viewer_count}`,
											StartedAt: `${person.started_at}`,
											Language: `${person.language}`,
											ThumbnailUrl: `${person.thumbnail_url}`,
											IsMature:`${person.is_mature}`,
										}, { where: {
											CodeName: 'Stream',
											UserLogin: `${person.user_login}`,
										} }));

										if (update) {
											console.log(`Data Update 3 / ${person.user_login}`);
										}
									}
									else if (!UserHistory.History.endsWith(',.')) {
										const update = await safeDBQuery(() => tables.live.update({
											History: `${UserHistory.History.concat(',.')}`,
											GameId: `${person.game_id || 0}`,
											GameName: `${person.game_name || 0}`,
											Type: `${person.type}`,
											Title: `${person.title}`,
											Tags: `${person.tags || 0}`,
											ViewerCount: `${person.viewer_count}`,
											StartedAt: `${person.started_at}`,
											Language: `${person.language}`,
											ThumbnailUrl: `${person.thumbnail_url}`,
											IsMature:`${person.is_mature}`,
										}, { where: {
											CodeName: 'Stream',
											UserLogin: `${person.user_login}`,
										} }));

										if (update) {
											console.log(`Data Update 4 / ${person.user_login}`);
										}
									}
								}
							}
						}

						if (index === data.data.length - 1) {
							// startTimerStream();
						}

					}, 6 * 1000 + Delay);
					Delay += 6 * 1000;
				});
			}
			setTimeout(async () => startTimerStream(), 1 * 60 * 1000);
		}

		async function TimerMsg() {
			// console.log('msg');
			if (!fs.existsSync(`${app.Twitch[2].bearersq}`)) {
				stopTimerStream(), startTimerStream();
			}

			if (!fs.existsSync(`${app.Twitch[2].bearersq}`)) return;

			if (!fs.existsSync(`${app.Twitch[0].livesq}`)) {
				return stopTimerStream(), startTimerStream();
			}

			const Users = await safeDBQuery(() => tables.live.findAll({
				attributes: ['id'],
				where: { CodeName: 'User' } }));

			const UsersId = Users.map(item => item.id);

			if (!`${UsersId}`) {
				stopTimerMsg(), startTimerMsg();
			}

			if (!`${UsersId}`) return;

			let Delay = 0;

			UsersId.forEach((personid, index) => {
				timer_message_delay = setTimeout(async () => {
					// console.log('msg');

					const UserId = await safeDBQuery(() => tables.live.findOne({
						where: { CodeName: 'User', id: `${personid}` } }));

					if (!UserId) {
						stopTimerMsg(), stopTimerMsgDelay(), startTimerMsg();
					}

					if (!UserId) return;

					const channel = ClientDiscord.channels.cache.get(`${UserId.ChannelId}`);

					if (!channel) {
						stopTimerMsg(), stopTimerMsgDelay(), startTimerMsg();
					}

					// console.log('1');

					// if (!channel) return console.log('msg');

					// console.log('2');

					const UserStream = await safeDBQuery(() => tables.live.findOne({
						where: {
							CodeName: 'Stream',
							UserLogin: `${UserId.UserLogin}`,
						} }));

					if (!UserStream) {
						// console.log('No UserStream');
						stopTimerMsg(), stopTimerMsgDelay(), startTimerMsg();
					}

					if (!UserStream) return;

					// console.log('msg');

					// const time = moment().utc().format('YYYYMMMMDhhmmss');

					const ms = Date.parse(`${moment()}`);

					const timestamp = `${UserStream.StartedAt}`;

					const date = new Date(timestamp);

					date.setHours(date.getHours() + 1);

					const formatter = new Intl.DateTimeFormat('en-US', {
						weekday: 'long',
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						hour12: true,
					});

					const output = formatter.format(date);

					const str = `${UserStream.Tags}`;
					const arr = str.split(',');
					const result = arr.map(item => `**[${item}](https://www.twitch.tv/directory/all/tags/${item})**`).join(' • ');


					const str2 = `${UserStream.History}`;
					const arr2 = str2.split(',');
					const result2 = arr2.map(item => `**[${item}](https://www.twitch.tv/directory/game/${item.replace(/ /g, '%20').toLowerCase()})**`).join('\n• ');

					const EmbedEn2 = new EmbedBuilder()
						.setAuthor({ name: `${UserId.DisplayName}`, url: `https://www.twitch.tv/${UserId.DisplayName.toLowerCase()}` })
						.setTitle(`${UserStream.GameName}`)
						.setURL(`https://www.twitch.tv/directory/game/${UserStream.GameName.replace(/ /g, '%20').toLowerCase()}`)
						.addFields(
							{ name: '\u200B', value: `${UserStream.Title}`, inline: false },
							{ name: 'Viewers', value: `${UserStream.ViewerCount}`, inline: true },
							{ name: 'Language', value: `${UserStream.Language}`, inline: true },
							{ name: 'Mature', value: `${UserStream.IsMature.replace(/false/g, '0').replace(/true/g, '18+')}`, inline: true },
							{ name: 'Tags', value: `${result}`, inline: false },
							{ name: 'History', value: `• ${result2.replace('**[.](https://www.twitch.tv/directory/game/.)**', 'Length limit . . .')}\n\n${UserId.BroadcasterType}`, inline: false },
						)
						.setThumbnail(`${UserId.ProfileImageUrl}`)
						.setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${UserId.UserLogin}-1280x720.png?cache=${ms}`)
						.setFooter({ text: `Twitch • Start of Stream: ${output} • Beta version 0.8`, iconURL: env.TwitchGif });

					const Message = `${UserId.RoleSwitch}` === 'off' &&
                          `${UserId.CategorySwitch}` === 'off' &&
                          `${UserId.GameSwitch}` === 'off';

					const Role = `${UserId.RoleSwitch}` === 'on' &&
                        `${UserId.CategorySwitch}` === 'off' &&
                        `${UserId.GameSwitch}` === 'off';

					if (Message) {
						// console.log('1');
						const Send1 = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'User',
								id: `${personid}`,
								Send: '1',
							} }));

						const Update1 = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'User',
								id: `${personid}`,
								Update: '1',
							} }));

						if (Send1) {
							channel.send({ embeds: [EmbedEn2] })
								.then(async (sent) => {
									const mid = sent.id;
									console.log(mid);

									const update = await safeDBQuery(() => tables.live.update({
										MessageId: `${mid}`,
										Send: '0',
									}, { where: {
										CodeName: 'User',
										id: `${personid}`,
									} }));

									if (update) {
										console.log(`Message Send / ${UserId.UserLogin}`);
									}
								})
								.catch(error => console.error('0', error));
						}
						else if (Update1) {
							if (`${Update1.MessageId}` !== '0') {
								channel.messages.fetch(`${Update1.MessageId}`)
									.then((message) => {
										message.edit({ embeds: [EmbedEn2] })
											.then(async (sent) => {
												const mid = sent.id;

												const update = await safeDBQuery(() => tables.live.update({
													MessageId: `${mid}`,
													Update: '0',
												}, { where: {
													CodeName: 'User',
													id: `${personid}`,
												} }));

												if (update) {
													console.log(`Message Update / ${UserId.UserLogin}`);
												}
											});
									})
									.catch(error => console.error('1', error));
							}
						}
					}
					else if (Role) {
						// console.log(`${personid}`);
						const Send1 = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'User',
								id: `${personid}`,
								Send: '1',
							} }));

						const Update1 = await safeDBQuery(() => tables.live.findOne({
							where: {
								CodeName: 'User',
								id: `${personid}`,
								Update: '1',
							} }));

						if (Send1) {
							console.log('1');
							channel.send({ content: `${Send1.RoleName}`, embeds: [EmbedEn2] })
								.then(async (sent) => {
									const mid = sent.id;

									const update = await safeDBQuery(() => tables.live.update({
										MessageId: `${mid}`,
										Send: '0',
									}, { where: {
										CodeName: 'User',
										id: `${personid}`,
									} }));

									if (update) {
										console.log(`Message Role Send / ${UserId.UserLogin}`);
									}
								})
								.catch(error => console.error('2', error));
						}
						else if (Update1) {
							// console.log('2');
							if (`${Update1.MessageId}` !== '0') {
								channel.messages.fetch(`${Update1.MessageId}`)
									.then((message) => {
										message.edit({ embeds: [EmbedEn2] })
											.then(async (sent) => {
												const mid = sent.id;

												const update = await safeDBQuery(() => tables.live.update({
													MessageId: `${mid}`,
													Update: '0',
												}, { where: {
													CodeName: 'User',
													id: `${personid}`,
												} }));

												if (update) {
													console.log(`Message Role Update / ${UserId.UserLogin}`);
												}
											});
									})
									.catch(error => console.error('3', error));
							}
						}
					}

					if (index === UsersId.length - 1) { startTimerMsg(); }

				}, 6 * 1000 + Delay);
				Delay += 6 * 1000;
			});
		}
	},
};

module.exports.msg = {
	Live: async (msg, ClientDiscord) => {
		if (msg.author.bot) return;

		if (!fs.existsSync(`./${app.Twitch[2].bearersq}`)) return;
		if (!fs.existsSync(`./${app.Twitch[2].bearersq}`)) return console.log('message.js / !live.sqlite');

		const lBearer = await tables.bearer.findOne({
			where: { CodeName: 'Bearer' } });

		if (!lBearer) return console.log('message.js / !bearer');

		const options = {
			method: 'get',
			headers: {
				'Client-ID': `${env.ClientTwitchId}`,
				'Authorization': `${lBearer.AccessToken}`,
			},
		};

		const lServer = await tables.server.findOne({
			where: { GuildId: `${msg.guild.id}` } });

		if (!lServer) return;

		const myPref = `${lServer.GuildPrefix}`;

		if (!msg.content.startsWith(myPref)) return;
		const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		if (!fs.existsSync(`./${app.Twitch[0].livesq}`)) return;

		const User = await tables.live.findOne({
			where: { CodeName: 'User', UserLogin: `${args[0]}`, GuildId: `${msg.guild.id}` } });

		if (command === 'live') {
			const channel = msg.mentions.channels.first();
			const role = msg.mentions.roles.first();

			if (!args.length) {
				return msg.channel.send('Додайте ім\'я стримера і #канал');
			}

			//

			/* if (args[0] === 'user') {
        if (!args[1]) return msg.channel.send('User: no user name');

        fetch(`${env.UserLogin}${args[1]}`, options)
          .then(response => response.json())
          .then(async (User) => {

            if (User.data[0] === undefined) {
              return msg.channel.send('User: user name (false)');
            }

            const channel = msg.mentions.channels.first();

            if (!channel) return msg.channel.send('User: no channel');

            if (!lUser) {

              const lStream = await tables.live.findOne({ where: {
                CodeName: 'stream',
                UserLogin: `${args[1]}`,
              } });

              if (!lStream) {
                const create = await tables.live.create({
                  CodeName: 'stream',
                  UserLogin: `${args[1]}`,
                  History: '0',
                  Category: '0',

                  GameId: '0',
                  GameName: '0',
                  Type: '0',
                  Title: '0',
                  Tags: '0',
                  ViewerCount: '0',
                  StartedAt: '0',
                  Language: '0',
                  ThumbnailUrl: '0',
                  IsMature: '0',

                  BoxArtUrl: '0',
                });
                if (create) {
                  msg.channel.send(`Stream: Create / ${User.data[0].display_name}`);
                }
              }

              const create2 = await tables.live.create({
                CodeName: 'user',
                Message: '0',
                MessageId: '0',
                ChannelName: `${channel}`,
                ChannelId: `${channel.id}`,
                RoleName: 'a',
                RoleId: '0',
                GuildName: `${msg.guild.name}`,
                GuildId: `${msg.guild.id}`,

                Role: 'off',
                Game: 'off',

                RoleSwitch: 'off',
                CategorySwitch: 'off',
                GameSwitch: 'off',

                Send: '0',
                Update: '0',

                Image: '2',

                UserLogin: `${args[1]}`,
                DisplayName: `${User.data[0].display_name}`,
                BroadcasterType: `${User.data[0].broadcaster_type}`,
                ProfileImageUrl: `${User.data[0].profile_image_url}`,
              });
              if (create2) {
                msg.channel.send(`User: Create / ${User.data[0].display_name}`);
              }
            }
            else

              if (lUser) {
                const update = await tables.live.update({
                  ChannelName: `${channel}`,
                  ChannelId: `${channel.id}`,
                  DisplayName: `${User.data[0].display_name}`,
                  ProfileImageUrl: `${User.data[0].profile_image_url}`,
                }, {
                  where: {
                    CodeName: 'user',
                    UserLogin: `${args[1]}`,
                    GuildId: `${msg.guild.id}`,
                  },
                });

                if (update) {
                  msg.channel.send(`User: Update / ${lUser.DisplayName}`);
                }
              }
          })
          .catch(error => console.error(error));
      }
      else */

			if (args[0] === 'role') {
				const lUser2 = await tables.live.findOne({
					where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
						GuildId: `${msg.guild.id}`,
					} });

				if (!args[1]) {
					return msg.channel.send('Role: no user name');
				}

				if (!role) return msg.channel.send('Role: no role name');

				if (!lUser2) return msg.channel.send('Up: user name (false)');

				if (lUser2.RoleSwitch === 'off') {
					const update = await tables.live.update({
						RoleSwitch: 'on',
						RoleName: `${role}`,
						RoleId: `${role.id}`,
					}, { where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
						GuildId: `${msg.guild.id}`,
					} });

					if (update) {
						msg.channel.send(`Role: on / ${lUser2.DisplayName}`);
					}
				}
				else

					if (lUser2.RoleSwitch === 'on') {
						const update = await tables.live.update({
							RoleSwitch: 'off',
							RoleName: `${role}`,
							RoleId: `${role.id}`,
						}, { where: {
							CodeName: 'User',
							UserLogin: `${args[1]}`,
							GuildId: `${msg.guild.id}`,
						} });

						if (update) {
							msg.channel.send(`Role: off / ${lUser2.DisplayName}`);
						}
					}
			}
			else if (args[0] === 'send' || args[0] === 's') {
				const lUser2 = await tables.live.findOne({
					where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
						GuildId: `${msg.guild.id}` } });

				if (!`${args[1]}`) return msg.channel.send('Send: no user name');

				if (!lUser2) return msg.channel.send('Send: user name (false)');

				const update1 = await tables.live.update({
					History: '0',
					GameName: '0',
				}, { where: {
					CodeName: 'Stream',
					UserLogin: `${args[1]}`,
				} });

				if (update1) {
					const update2 = await tables.live.update({
						MessageId: '0',
					}, { where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
					} });

					if (update2) {
						msg.channel.send(`Send Message / ${lUser2.DisplayName}`);
					}
				}
			}
			else if (args[0] === 'update' || args[0] === 'up' || args[0] === 'u') {
				const lUser2 = await tables.live.findOne({
					where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
						GuildId: `${msg.guild.id}` } });

				if (!args[1]) return msg.channel.send('Update: no user name');

				if (!lUser2) return msg.channel.send('Update: user name (false)');

				const update = await tables.live.update({
					GameName: '1',
				}, {
					where: {
						CodeName: 'Stream',
						UserLogin: `${args[1]}`,
					},
				});

				if (update) {
					msg.channel.send(`Update Message / ${lUser2.DisplayName}`);
				}
			}
			else if (args[0] === 'list' || args[0] === 'l') {
				const Streamer = await tables.live.findOne({
					where: { CodeName: 'User', UserLogin: `${args[1]}`, GuildId: `${msg.guild.id}` } });

				if (Streamer) {
					const EmbedEn = new EmbedBuilder()
						.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
						.setDescription('Twitch Stream')
						.addFields(
							{ name: '\u200B', value: '\u200B' },
							// { name: 'ID', value: `${Streamer.id}`, inline: true },
							{ name: 'Name', value: `${Streamer.DisplayName}`, inline: true },
							{ name: 'Role', value: `${Streamer.RoleName}`, inline: true },
							{ name: 'Channel', value: `${Streamer.ChannelName}`, inline: false },
							{ name: 'Message ID', value: `${Streamer.MessageId}`, inline: true },
							{ name: 'Send', value: `${Streamer.Send}`, inline: true },
							{ name: 'Update', value: `${Streamer.Update}`, inline: true },
						)
						.setImage(env.StripMenu)
						.setFooter({ text: 'Twitch', iconURL: env.TwitchGif });

					return msg.channel.send({ embeds: [EmbedEn] });
				}

				const UsersName = await tables.live.findAll({
					attributes: ['DisplayName', 'RoleName'],
					where: { CodeName: 'User', GuildId: `${msg.guild.id}` } });

				const lUsersName = UsersName.map(item => item .DisplayName);
				const lRoleName = UsersName.map(item => item .RoleName);

				const str = `${lUsersName}`;
				const arr = str.split(',');
				const result = arr.map(item => `**[${item || 'This list is empty'}](https://www.twitch.tv/${item})**`).join('\n• ');

				const str2 = `${lRoleName}`;
				const arr2 = str2.split(',');
				const result2 = arr2.map(item => `${item.replace(/a/g, 'Role not assigned')}`).join('\n');

				if (!`${lUsersName}`) {
					const EmbedEn = new EmbedBuilder()
						.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
						.setDescription('Twitch Stream')
						.addFields(
							{ name: '\u200B', value: '\u200B' },
							{ name: 'Streamers', value: '• This list is empty', inline: true },
							{ name: 'Roles', value: 'There is no role', inline: true },
						)
						.setImage(env.StripMenu)
						.setFooter({ text: 'Twitch', iconURL: env.TwitchGif });

					return msg.channel.send({ embeds: [EmbedEn] });
				}

				const EmbedEn = new EmbedBuilder()
					.setAuthor({ name: 'Twitch', url: 'https://www.twitch.tv/' })
					.setDescription('Twitch Stream')
					.addFields(
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Streamers', value: `• ${result}`, inline: true },
						// { name: 'Roles', value: `${lRoleName.replace(/'0'/g, 'Role not assigned')}`, inline: true },
						{ name: 'Roles', value: `${result2}`, inline: true },
					)
					.setImage(env.StripMenu)
					.setFooter({ text: 'Twitch', iconURL: env.TwitchGif });

				msg.channel.send({ embeds: [EmbedEn] });
			}
			else if (args[0] === 'delete' || args[0] === 'del' || args[0] === 'd') {
				const User2 = await tables.live.findOne({
					where: {
						CodeName: 'User',
						UserLogin: `${args[1]}`,
						GuildId: `${msg.guild.id}` } });

				if (!args[1]) {
					return msg.channel.send('Del: user name / all');
				}

				if (args[1] === 'str') {
					const destroy = await tables.live.destroy({ where: {
						CodeName: 'Stream',
					} });

					if (destroy) {
						msg.channel.send('Delete: Stream');
					}
				}
				else if (args[1] === 'all') {
					const destroy = await tables.live.destroy({
						where: { GuildId: `${msg.guild.id}` } });

					if (destroy) {
						msg.channel.send('Delete: all');
					}
				}
				else if (args[1] !== 'all') {
					if (!User2) {
						return msg.channel.send('Del: user name (false)');
					}

					const destroy = await tables.live.destroy({
						where: {
							CodeName: 'User',
							UserLogin: `${args[1]}`,
							GuildId: `${msg.guild.id}` } });

					if (destroy) {
						msg.channel.send(`Delete: ${args[1]}`);
					}
				}
			}
			else {
				if (args[0] === `${channel}`) {
					return msg.channel.send('Спочатку додайте ім\'я стримера, а потім #канал');
				}

				if (!channel) {
					return msg.channel.send('Додайте #канал');
				}

				const response = await fetch(`${env.UserLogin}${args[0]}`, options);
				const data = await response.json();

				if (!data.data || data.data[0] === undefined || data.data[0] === null) {
					return msg.channel.send(`Імені стримера ${args[0]} не існує`);
				}

				const channelId = ClientDiscord.channels.cache.get(`${channel.id}`);

				if (!channelId) {
					return msg.channel.send(`Каналу ${args[1]} не існує`);
				}

				if (!User) {
					const Stream = await tables.live.findOne({
						where: { CodeName: 'Stream', UserLogin: `${args[0]}` } });

					if (!Stream) {
						const createUser = await tables.live.create({
							CodeName: 'Stream',
							UserLogin: `${args[0]}`,
							History: '0',
							Category: '0',

							GameId: '0',
							GameName: '1',
							Type: '0',
							Title: '0',
							Tags: '0',
							ViewerCount: '0',
							StartedAt: '0',
							Language: '0',
							ThumbnailUrl: '0',
							IsMature: '0',

							BoxArtUrl: '0',

							GuildId: `${msg.guild.id}`,
						});

						if (createUser) {
							msg.channel.send(`Stream Create: ${data.data[0].display_name}`)
								.then(async () => {
									const createStream = await tables.live.create({
										CodeName: 'User',
										Message: '0',
										MessageId: '0',
										ChannelName: `${channel}`,
										ChannelId: `${channel.id}`,
										RoleName: 'a',
										RoleId: '0',
										GuildName: `${msg.guild.name}`,
										GuildId: `${msg.guild.id}`,

										Role: 'off',
										Game: 'off',

										RoleSwitch: 'off',
										CategorySwitch: 'off',
										GameSwitch: 'off',

										Send: '0',
										Update: '0',

										Image: '2',

										UserLogin: `${args[0]}`,
										DisplayName: `${data.data[0].display_name}`,
										BroadcasterType: `${data.data[0].broadcaster_type}`,
										ProfileImageUrl: `${data.data[0].profile_image_url}`,
									});

									if (createStream) {
										msg.channel.send(`User Create: ${data.data[0].display_name}`);
									}
								});
						}
					}
					else if (Stream) {
						// console.log('stream y');
						await tables.live.update({
							History: '0',
							Category: '0',

							GameId: '0',
							GameName: '1',
							Type: '0',
							Title: '0',
							Tags: '0',
							ViewerCount: '0',
							StartedAt: '0',
							Language: '0',
							ThumbnailUrl: '0',
							IsMature: '0',

							BoxArtUrl: '0',
						}, { where: {
							CodeName: 'Stream',
							UserLogin: `${args[0]}`,
							GuildId: `${msg.guild.id}`,

						} });
					}
				}
				else if (User) {
					const update = await tables.live.update({
						ChannelName: `${channel}`,
						ChannelId: `${channel.id}`,
						DisplayName: `${data.data[0].display_name}`,
						ProfileImageUrl: `${data.data[0].profile_image_url}`,
					}, { where: {
						CodeName: 'User',
						UserLogin: `${args[0]}`,
						GuildId: `${msg.guild.id}`,
					} });

					if (update) {
						msg.channel.send(`User Update: ${User.DisplayName}`);
					}
				}
			}
		}
	},
};
