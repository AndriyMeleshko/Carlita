console.log('file time');

const moment = require('moment');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env;

const { MessageEmbed } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './time/time.sqlite',
});

const time = sequelize.define('time', {
  name: Sequelize.TEXT,
  time: Sequelize.STRING,
  channelname: Sequelize.STRING,
  channelid: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
});

module.exports = { time };

time.sync();

setInterval(async () => {
  if (!fs.existsSync('./time/time.sqlite')) return;

  const lTime = await time.findOne({ where: { name: 'time' } });

  if (!lTime) {
    const create = await time.create({
      name: 'time',
      time: '0',
    });
    if (create) {
      console.log(`${moment().locale('en').add(create, 'h').format('hh:mm:ss a')} | New Time: ${create.time}`);
    }
  }
}, 1000);

module.exports.msg = {
  Time: async (msg) => {
    if (msg.author.bot) return;

    const tServ = require('../discord/main/server/server.js');

    if (!fs.existsSync('./time/time.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lTime = await time.findOne({ where: { name: 'time' } });

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    if (command === 'time' || command === 'час') {
      if (!args.length) {
        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: add / list / del', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Додайте: add / list / del', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      if (args[0] === 'add') {
        if (!args[1]) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add the number of hours.', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте кількість годин.', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (isNaN(args[1])) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Specify the hours in numbers.', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Вкажіть години цифрами.', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (!lTime) {
          const create = await time.create({
            name: 'time',
            time: `${args[1]}`,
          });
          if (create) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Created time', value: `${moment().locale('en').add(`${args[1]}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                  { name: 'Added hours', value: `${args[1]}` || '0', inline: false },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Створений час', value: `${moment().locale('uk').add(`${args[1]}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                  { name: 'Додані години', value: `${args[1]}` || '0', inline: false },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
          }
        }
        else if (lTime) {
          const update = await time.update({
            time: `${args[1]}`,
          }, {
            where: {
              name: 'time',
            },
          });
          if (update) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Updated time', value: `${moment().locale('en').add(`${args[1]}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                  { name: 'Added hours', value: `${args[1]}` || '0', inline: false },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Оновлений час', value: `${moment().locale('uk').add(`${args[1]}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                  { name: 'Додані години', value: `${args[1]}` || '0', inline: false },
                  { name: '\u200B', value: '\u200B' },
                )
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
          }
        }
      }

      if (args[0] === 'list') {
        const lTimes = await time.findAll({ attributes: ['time'] });
        const sTime = lTimes.map(t => t.time).join(' ') || '0';

        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Time', value: `${moment().locale('en').add(`${sTime}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
              { name: 'Added hours', value: `${sTime}`, inline: false },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Час', value: `${moment().locale('uk').add(`${sTime}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
              { name: 'Додані години', value: `${sTime}`, inline: false },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      if (args[0] === 'del') {
        const destroy = await time.destroy({
          where: {
            name: 'time',
          },
        });
        if (destroy) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'Time has been deleted.', inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Вітаю!', value: 'Час був видалений.', inline: true },
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
