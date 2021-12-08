let iLive = -1;

const tTime = require('../../../time/time.js');
const tBearer = require('../../../discord/main/bearer/bearer.js');
const tServer = require('../../../discord/main/server/server.js');

const Sequelize = require('sequelize');
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

const env = process.env;

const { Client, Intents, Permissions, MessageEmbed } = require('discord.js');

const clientDiscord = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  partials: [
    'MESSAGE',
    'CHANNEL',
    'REACTION',
    'GUILD_MEMBER',
    'USER',
  ],
  ws: { intents: [
    'DIRECT_MESSAGES',
    'DIRECT_MESSAGE_REACTIONS',
    'GUILDS',
    'GUILD_BANS',
    'GUILD_EMOJIS',
    'GUILD_INVITES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_VOICE_STATES',
  ],
  },
});

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/admin/twitch/live.sqlite',
});

const live = sequelize.define('live', {
  codename: Sequelize.TEXT,
  timeout: Sequelize.STRING,
  category: Sequelize.TEXT,
  gamename: Sequelize.STRING,
  channelname: Sequelize.STRING,
  channelid: Sequelize.STRING,
  rolename: Sequelize.STRING,
  roleid: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,

  userid: Sequelize.STRING,
  userlogin: Sequelize.STRING,
  username: Sequelize.STRING,
  gameid: Sequelize.STRING,
  type: Sequelize.STRING,
  title: Sequelize.STRING,
  viewercount: Sequelize.STRING,
  startedat: Sequelize.STRING,
  language: Sequelize.STRING,
  thumbnailurl: Sequelize.STRING,
});

live.sync();

module.exports = { live };

module.exports.ready = {
  Live: async () => {
    const lTime = await tTime.time.findOne({ where: { name: 'time' } });

    const lBearer = await tBearer.bearer.findOne({ where: { name: 'bearer' } });

    if (!lBearer) return;

    const options = {
      method: 'get',
      headers: {
        'Client-ID': env.clientTwitchId,
        'Authorization': `${lBearer.accesstoken}`,
      },
    };

    setInterval(async () => {

      const lLives = await live.findAll({ attributes: [
        'userlogin',
      ], where: {
        codename: 'live',
      } });

      if (!lLives) return;

      const userlogin = lLives.map(l => l.userlogin);

      iLive++;
      if (!userlogin[iLive]) iLive = 0;

      fetch(`${env.stream}${userlogin[iLive]}`, options)
        .then(response => response.json())
        .then(async (Stream) => {

          const lUser = await live.findOne({ where: {
            userlogin: `${userlogin[iLive]}`,
          } });

          if (!lUser) return;

          const channel = clientDiscord.channels.cache.get(`${lUser .channelid}`);

          if (Stream.data[0] === undefined) {

            await live.update({
              timeout: '0',
            }, {
              where: {
                userlogin: `${userlogin[iLive]}`,
              },
            });

            const lTimeout0 = await live.findOne({ where: {
              userlogin: `${userlogin[iLive]}`,
              timeout: '0',
            } });

            if (!lTimeout0) return;

            const lType = await live.findOne({ where: {
              userlogin: `${userlogin[iLive]}`,
              type: 'online',
            } });

            if (!lType) return;

            const lLive = await live.findOne({ where: {
              codename: 'live',
            } });

            const lTimeout = `${lLive.timeout}`;
            const lTimenow = `${moment().utc().locale('en').format()}`;

            // console.log(`${lTimeout} ${lTimenow}`);

            if (lTimeout > lTimenow) return;

            await live.update({
              timeout: `${moment().utc().locale('en').add(5, 'm').format()}`,
            }, {
              where: {
                userlogin: `${userlogin[iLive]}`,
              },
            });

            if (lTimeout === '0') return;

            if (lTimeout > lTimenow) return;

            const update = await live.update({
              type: 'offline',
            }, {
              where: {
                userlogin: `${userlogin[iLive]}`,
              },
            });

            if (update) {
              return console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Discord: ${lLive.guildname} #${channel.name} | Twitch: ${lLive.userlogin} | Offline`);
            }
          }

          fetch(`${env.user}${userlogin[iLive]}`, options)
            .then(response => response.json())
            .then(async (User) => {

              const listTypeGame = await live.findOne({ where: {
                userlogin: `${userlogin[iLive]}`,
                type: 'online',
                gameid: `${Stream.data[0].game_id}`,
              } });

              if (listTypeGame) return;

              if (!listTypeGame) {

                const update = await live.update({
                  type: 'online',
                  gameid: `${Stream.data[0].game_id}`,
                }, {
                  where: {
                    userlogin: `${userlogin[iLive]}`,
                  },
                });

                if (update) {

                  const lLive = await live.findOne({ where: {
                    codename: 'live',
                  } });

                  const lServer = await tServer.server.findOne({ where: {
                    guildid: `${lUser.guildid}`,
                  } });

                  const myLang = `${lServer.guildlanguage}`;

                  console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Discord: ${lUser.guildname} #${channel.name} | Twitch: ${Stream.data[0].user_name} ${Stream.data[0].game_name} | Online`);

                  // console.log(`${Stream.data[0].user_name} is now online on https://www.twitch.tv/${Stream.data[0].user_login}`);

                  if (myLang === 'en') {
                    const embed = new MessageEmbed()
                      .setAuthor(`${Stream.data[0].user_name}`, '', `https://www.twitch.tv/${Stream.data[0].user_name.toLowerCase()}`)
                      .setTitle(`${Stream.data[0].game_name}`)
                      .setURL(`https://www.twitch.tv/directory/game/${Stream.data[0].game_name.replace(/ /g, '%20').toLowerCase()}`)
                      .addFields(
                        { name: '\u200B', value: `${Stream.data[0].title}`, inline: false },
                        { name: 'Viewer', value: `${Stream.data[0].viewer_count}`, inline: true },
                        { name: 'Language', value: `${Stream.data[0].language}`, inline: true },
                      )
                      .setThumbnail(`${User.data[0].profile_image_url}`)
                      .setImage(`https://static-cdn.jtvnw.net/ttv-boxart/${Stream.data[0].game_name.replace(/ /g, '%20')}-300x400.jpg`)
                      .setFooter('Twitch', env.twitchgif);

                    const lGame = await live.findOne({ where: {
                      userlogin: `${userlogin[iLive]}`,
                      gamename: `${Stream.data[0].game_name}`,
                    } });

                    const lRole0 = await live.findOne({ where: {
                      userlogin: `${userlogin[iLive]}`,
                      rolename: '0',
                    } });

                    const lCategory = await live.findOne({ where: {
                      userlogin: `${userlogin[iLive]}`,
                      category: 'on',
                    } });

                    if (lGame) {

                      if (lRole0) {
                        channel.send({ embeds: [embed] });
                      }
                      else

                      if (lCategory) {
                        channel.send({ embeds: [embed] });
                      }
                      else

                      if (!lCategory) {
                        channel.send({ content: `${lLive.rolename}`, embeds: [embed] });
                      }
                    }
                    else

                    if (lRole0) {
                      channel.send({ embeds: [embed] });
                    }
                    else

                    if (lCategory) {
                      channel.send({ embeds: [embed] });
                    }
                    else

                    if (!lCategory) {
                      channel.send({ content: `${lLive.rolename}`, embeds: [embed] });
                    }
                  }
                  else

                  if (myLang === 'uk') {
                    const embed = new MessageEmbed()
                      .setAuthor(`${Stream.data[0].user_name}`, '', `https://www.twitch.tv/${Stream.data[0].user_name.toLowerCase()}`)
                      .setTitle(`${Stream.data[0].game_name}`)
                      .setURL(`https://www.twitch.tv/directory/game/${Stream.data[0].game_name.replace(/ /g, '%20').toLowerCase()}`)
                      .addFields(
                        { name: '\u200B', value: `${Stream.data[0].title}`, inline: false },
                        { name: 'Глядачів', value: `${Stream.data[0].viewer_count}`, inline: true },
                        { name: 'Мова', value: `${Stream.data[0].language}`, inline: true },
                      )
                      .setThumbnail(`${User.data[0].profile_image_url}`)
                      .setImage(`https://static-cdn.jtvnw.net/ttv-boxart/${Stream.data[0].game_name.replace(/ /g, '%20')}-300x400.jpg`)
                      .setFooter('Twitch', env.twitchgif);

                    const lGame = `${lUser.gamename}` === `${Stream.data[0].game_name}`;

                    const lRole = `${lUser.rolename !== '0'}`;

                    const lCategory = `${lUser.category === 'on'}`;

                    if (lGame) {
                      if (`${lUser.gamename}` === `${Stream.data[0].game_name}`) {

                      }
                      else {
                        return;
                      }

                      if (lRole) {

                        if (!lCategory) {

                          channel.send({ content: `${lLive.rolename}`, embeds: [embed] });
                        }
                        if (lRole.rolename === '0') {
                          channel.send({ content: '6', embeds: [embed] });
                        }
                      }
                      if (lCategory.category === 'off') {
                        if (lRole.rolename === '0') {
                          channel.send({ content: `8 ${lLive.rolename}`, embeds: [embed] });
                        }
                        if (lRole.rolename === '0') {
                          channel.send({ content: '6', embeds: [embed] });
                        }
                      }
                    }
                  }
                }
              }
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));

    }, 5 * 1000);
  },
};

module.exports.msg = {
  Live: async (msg) => {
    if (msg.author.bot) return;

    const admin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const owner = msg.member.id === env.ownerdiscordid;

    if (!fs.existsSync('./discord/admin/twitch/live.sqlite')) return;

    const lBearer = await tBearer.bearer.findOne({ where: { name: 'bearer' } });
    if (!lBearer) return;

    const options = {
      method: 'get',
      headers: {
        'Client-ID': env.clientTwitchId,
        'Authorization': `${lBearer.accesstoken}`,
      },
    };

    const lServ = await tServer.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    const Strip300 = env.stripmsg300;

    const channel = msg.mentions.channels.first();
    const role = msg.mentions.roles.first();

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'live') {

      if (admin || owner) {

        if (!args.length) {
          if (myLang === 'uk') {
            const embed = new MessageEmbed()
              .setAuthor('Twitch', '', 'https://www.twitch.tv/')
              .setDescription('Twitch Live')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте: add/a / <@role> / list/l', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Twitch', env.twitchgif);
            return msg.channel.send({ embeds: [embed] });
          }
        }

        if (args[0] === 'add' || args[0] === 'a') {

          if (!args[1]) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте: Сторінку Twitch.', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          fetch(`${env.user}${args[1]}`, options)
            .then(response => response.json())
            .then(async User => {

              if (!User.data[0]) {
                if (myLang === 'uk') {
                  const embed = new MessageEmbed()
                    .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                    .setDescription('Twitch Live')
                    .addFields(
                      { name: '\u200B', value: '\u200B' },
                      { name: 'Увага!', value: `Сторінка **${args[1]}** не знайдена.\nПеревірте правильність вводу імені сторінки.`, inline: true },
                    )
                    .setImage(Strip300)
                    .setFooter('Twitch', env.twitchgif);
                  return msg.channel.send({ embeds: [embed] });
                }
              }

              const lUser = await live.findOne({ where: {
                userlogin: `${args[1]}`,
              } });

              if (!args[2]) {
                if (myLang === 'uk') {
                  const embed = new MessageEmbed()
                    .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                    .setDescription('Twitch Live')
                    .addFields(
                      { name: '\u200B', value: '\u200B' },
                      { name: 'Увага!', value: 'Додайте: <#channel>', inline: true },
                    )
                    .setImage(Strip300)
                    .setFooter('Twitch', env.twitchgif);
                  return msg.channel.send({ embeds: [embed] });
                }
              }

              if (args[2] !== `${channel}`) {
                if (myLang === 'uk') {
                  const embed = new MessageEmbed()
                    .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                    .setDescription('Twitch Live')
                    .addFields(
                      { name: '\u200B', value: '\u200B' },
                      { name: 'Увага!', value: 'Додайте: існуючий <#channel>', inline: true },
                    )
                    .setImage(Strip300)
                    .setFooter('Twitch', env.twitchgif);
                  return msg.channel.send({ embeds: [embed] });
                }
              }

              if (!lUser) {
                const create = await live.create({
                  codename: 'live',
                  gamename: '0',
                  category: 'off',
                  rolename: '0',
                  timeout: '0',
                  channelname: `${channel}`,
                  channelid: `${channel.id}`,
                  guildname: `${msg.guild.name}`,
                  guildid: `${msg.guild.id}`,

                  userlogin: `${User.data[0].login}`,
                  username: `${User.data[0].display_name}`,
                  type: 'offline',
                  gameid: '0',
                });

                if (create) {
                  if (myLang === 'uk') {
                    const embed = new MessageEmbed()
                      .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                      .setDescription('Twitch Live')
                      .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Вітаю!', value: `Сторінка **${args[1]}** успішно додана.`, inline: true },
                      )
                      .setImage(Strip300)
                      .setFooter('Twitch', env.twitchgif);
                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }
              else

              if (lUser) {
                const update = await live.update({
                  codename: 'live',
                  gamename: '0',
                  category: 'off',
                  rolename: '0',
                  timeout: '0',
                  channelname: `${channel}`,
                  channelid: `${channel.id}`,
                  guildname: `${msg.guild.name}`,

                  username: `${User.data[0].display_name}`,
                  type: 'offline',
                  gameid: '0',
                }, {
                  where: {
                    userlogin: `${args[1]}`,
                    guildid: `${msg.guild.id}`,
                  },
                });

                if (update) {
                  if (myLang === 'uk') {
                    const embed = new MessageEmbed()
                      .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                      .setDescription('Twitch Live')
                      .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Вітаю!', value: `Сторінка **${args[1]}** успішно оновлена.`, inline: true },
                      )
                      .setImage(Strip300)
                      .setFooter('Twitch', env.twitchgif);
                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }
            });
        }

        if (args[0] === 'game') {

          if (!args[1]) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте: Сторінку Twitch зі списку.', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          if (!args[2]) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте: Назву гри.', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          const lUser = await live.findOne({ where: {
            userlogin: `${args[1]}`,
          } });

          if (!lUser) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Сторінка **${args[1]}** не знайдена.\nПеревірте правильність вводу імені сторінки.`, inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          fetch(`${env.game}${args[2]}`, options)
            .then(response => response.json())
            .then(async Game => {

              if (!Game.data[0]) {
                if (myLang === 'uk') {
                  const embed = new MessageEmbed()
                    .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                    .setDescription('Twitch Live')
                    .addFields(
                      { name: '\u200B', value: '\u200B' },
                      { name: 'Увага!', value: `Гра **${args[2]}** не знайдена.\nПеревірте правильність вводу назви гри.`, inline: true },
                    )
                    .setImage(Strip300)
                    .setFooter('Twitch', env.twitchgif);
                  return msg.channel.send({ embeds: [embed] });
                }
              }

              const update = await live.update({
                game: `${args[2]}`,
              }, {
                where: {
                  userlogin: `${args[1]}`,
                  guildid: `${msg.guild.id}`,
                },
              });

              if (update) {
                if (myLang === 'uk') {
                  const embed = new MessageEmbed()
                    .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                    .setDescription('Twitch Live')
                    .addFields(
                      { name: '\u200B', value: '\u200B' },
                      { name: 'Вітаю!', value: `Гра **${args[2]}** успішно додана.`, inline: true },
                    )
                    .setImage(Strip300)
                    .setFooter('Twitch', env.twitchgif);
                  msg.channel.send({ embeds: [embed] });
                }
              }
            });
        }

        if (args[0] === 'role') {

          if (!args[1]) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте: Сторінку Twitch зі списку.', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          const lUser = await live.findOne({ where: {
            userlogin: `${args[1]}`,
          } });

          if (!lUser) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Сторінка **${args[1]}** не знайдена.\nПеревірте правильність вводу імені сторінки.`, inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          if (!role) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте: @роль.', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          const update = await live.update({
            rolename: `${role}`,
            roleid: `${role.id}`,
          }, {
            where: {
              userlogin: `${args[1]}`,
              guildid: `${msg.guild.id}`,
            },
          });

          if (update) {
            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Live')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Вітаю!', value: `Роль ${role} успішно додана.`, inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }

        if (args[0] === 'up') {

          await live.update({
            type: 'offline',
          }, {
            where: {
              userlogin: `${args[1]}`,
              guildid: `${msg.guild.id}`,
            },
          });
        }

        if (args[0] === 'up2') {
          await live.update({
            type: 'online',
          }, {
            where: {
              userlogin: `${args[1]}`,
              guildid: `${msg.guild.id}`,
            },
          });
        }

        if (args[0] === 'timeout' || args[0] === 't') {
          await live.update({
            timeout: `${moment().utc().locale('en').add(args[1], 'm').format()}`,
          }, {
            where: {
              codename: 'live',
            },
          });
        }

        if (args[0] === 'list' || args[0] === 'l') {
          const lLives = await live.findAll({ attributes: [
            'codename',
            'category',
            'gamename',
            'rolename',
            'userlogin',
            'type',
            'channelname',
            'channelid',
            'guildname',
            'guildid',
          ], where: { guildid: `${msg.guild.id}` } });

          // const codename = lLives.map(l => l.codename).join('\n') || '0';
          const userlogin = lLives.map(l => l.userlogin).join('\n') || '0';
          const rolename = lLives.map(l => l.rolename).join('\n') || '0';
          const type = lLives.map(l => l.type).join('\n') || '0';
          const channelname = lLives.map(l => l.channelname).join('\n') || '0';
          const category = lLives.map(l => l.category).join('\nCategory: ') || '0';
          const gamename = lLives.map(l => l.gamename).join('\nGame: ') || '0';
          // const channelid = lLives.map(l => l.channelid).join('\n') || '0';
          // const guildname = lLives.map(l => l.guildname).join('\n') || '0';
          // const guildid = lLives.map(l => l.guildid).join('\n') || '0';

          const EmbedList = new MessageEmbed()
            .setAuthor('Twitch', '', 'https://www.twitch.tv/')
            .setDescription('Twitch Live')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              // { name: 'Code', value: `${codename}`, inline: true },
              { name: 'User', value: `${userlogin}`, inline: true },
              { name: 'Type', value: `${type}`, inline: true },
              { name: 'Channel', value: `${channelname}`, inline: true },
              { name: 'User', value: `${userlogin}`, inline: true },
              { name: 'Filter', value: `Game: ${gamename}`, inline: true },
              { name: 'Additionally', value: `Category: ${category}`, inline: true },
              { name: 'User', value: `${userlogin}`, inline: true },
              { name: 'Role', value: `${rolename}`, inline: true },
              // { name: 'Channel ID', value: `${channelid}`, inline: true },
              // { name: 'Guild', value: `${guildname}`, inline: true },
              // { name: 'Guild ID', value: `${guildid}`, inline: true },
            )
            .setImage(Strip300)
            .setFooter('Twitch', env.twitchgif);
          msg.channel.send({ embeds: [EmbedList] });
        }
      }
    }
  },
};
clientDiscord.login(env.clientDiscordToken);
