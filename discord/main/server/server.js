console.log('file server');

// let iGuilds = -1;

const tTime = require('../../../time/time.js');

const moment = require('moment');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env;

const { Permissions, MessageEmbed } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/main/server/server.sqlite',
});

const server = sequelize.define('server', {
  name: Sequelize.TEXT,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
  guildprefix: Sequelize.STRING,
  guildlanguage: Sequelize.STRING,
});

module.exports = { server };

server.sync();

module.exports.ready = {
  Server: async () => {
    console.log('ready server');

    if (!fs.existsSync('./time/time.sqlite')) tTime.time.sync();
    if (!fs.existsSync('./discord/main/server/server.sqlite')) server.sync();

    const lTime = await tTime.time.findOne({ where: { name: 'time' } });

    const ready = require('../../../discord/discord.js');
    const guilds = ready.server.guild;

    guilds.map(async (guild) => {
      const lServ = await server.findOne({ where: { guildid: `${guild.id}` } });

      if (!lServ) {
        const create = await server.create({
          name: 'server',
          guildname: `${guild.name}`,
          guildid: `${guild.id}`,
          guildprefix: `${env.prefix}`,
          guildlanguage: 'en',
        });
        if (create) {
          console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Discord | New Server: ${create.guildname} | ID: ${create.guildid} | Prefix: ${create.guildprefix} | Language: ${create.guildlanguage}`);
        }
      }
    });

    setInterval(async () => {
      guilds.map(async (guild) => {
        const lServ = await server.findOne({ where: { guildid: `${guild.id}` } });

        if (!lServ) {
          const create = await server.create({
            name: 'server',
            guildname: `${guild.name}`,
            guildid: `${guild.id}`,
            guildprefix: `${env.prefix}`,
            guildlanguage: 'en',
          });
          if (create) {
            console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Discord | New Server: ${create.guildname} | ID: ${create.guildid} | Prefix: ${create.guildprefix} | Language: ${create.guildlanguage}`);
          }
        }
      });
    }, 10000);

    /* const listServs = await server.findAll({
      attributes: ['guildname', 'guildid', 'guildprefix', 'guildlanguage'],
    });
    const listGuildname = listServs.map(t => t.guildname);
    const listGuildid = listServs.map(t => t.guildid);
    const listGuildPrefix = listServs.map(t => t.guildprefix);
    const listGuildLanguage = listServs.map(t => t.guildlanguage);

    iGuilds++;
    if (!listGuildid[iGuilds]) iGuilds = 0; */

    // const ready2 = require('../../../discord/discord.js');
    // const GuildsId = ready2.guild.gid2;

    // const guildid = clientDiscord.guilds.cache.get(`${listGuildid[iGuilds]}`);

    /* if (!GuildsId) {
      const destroy = await server.destroy({ where: {
        guildid: `${listGuildid[iGuilds]}`,
      },
      });
      if (destroy) {
        console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Discord | Destroy Server: ${listGuildname[iGuilds]} | ID: ${listGuildid[iGuilds]} | Prefix: ${listGuildPrefix[iGuilds]} | Language: ${listGuildLanguage[iGuilds]}`);
      }
    } */
  },
};

module.exports.msg = {
  Server: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./time/time.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lServ = await server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const admin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const owner = msg.member.id === env.ownerDiscordId;

    if (command === 'prefix' || command === 'pref' ||
        command === 'префікс' || command === 'преф') {
      if (admin || owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Prefix')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Prefix:', value: `${lServ.guildprefix}`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Prefix')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Префікс:', value: `${lServ.guildprefix}`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0]) {
          const lPref = await server.findOne({ where: { guildprefix: `${args[0]}`, guildid: `${msg.guild.id}` } });

          if (lPref) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: `The prefix: **${args[0]}** is already set.` },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Префікс: **${args[0]}** вже встановлений.` },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }
          }

          const update = await server.update({
            guildprefix: `${args[0]}`,
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: `Prefix replaced with: **${args[0]}**` },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Вітаю!', value: `Префікс замінений на: **${args[0]}**` },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
          }
        }
      }
    }

    if (command === 'language' || command === 'lang' ||
        command === 'мова') {
      if (admin || owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Language:', value: `**${lServ.guildlanguage}** / sp / uk`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Мова:', value: `en / sp / **${lServ.guildlanguage}**`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'en') {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'English is already installed.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          const update = await server.update({
            guildlanguage: 'en',
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'The language has been replaced by English.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'uk') {
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Вже встановлена українська мова.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          const update = await server.update({
            guildlanguage: 'uk',
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Вітаю!', value: 'Мова замінена на українську.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'sp') {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Sorry, spanish is missing.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Вибачте, іспанська мова відсутня.' },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }
      }
    }

    if (command === 'server' || command === 'serv' ||
        command === 'сервер' || command === 'серв') {
      if (owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add: list', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте: list', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'list') {
          const lServs = await server.findAll({ attributes: ['guildname', 'guildid', 'guildprefix', 'guildlanguage'] });

          const guildName = lServs.map(t => t.guildname).join('\n') || '0';
          const guildId = lServs.map(t => t.guildid).join('\n') || '0';
          const guildPrefix = lServs.map(t => t.guildprefix).join('\n') || '0';
          const guildLanguage = lServs.map(t => t.guildlanguage).join('\n') || '0';

          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Server', value: `${guildName}`, inline: true },
                { name: 'Prefix', value: `${guildPrefix}`, inline: true },
                { name: 'Language', value: `${guildLanguage}`, inline: true },
                { name: 'Server', value: `${guildName}`, inline: true },
                { name: 'ID', value: `${guildId}`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Сервер', value: `${guildName}`, inline: true },
                { name: 'Префікс', value: `${guildPrefix}`, inline: true },
                { name: 'Мова', value: `${guildLanguage}`, inline: true },
                { name: 'Сервер', value: `${guildName}`, inline: true },
                { name: 'ІД', value: `${guildId}`, inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }
        }
      }
    }
  },
};
