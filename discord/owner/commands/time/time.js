const tTime = require('../../../../time/time.js');
const tServer = require('../../../../discord/main/server/server.js');

const moment = require('moment');
const fs = require('fs');

const env = process.env;

const { MessageEmbed } = require('discord.js');

module.exports.msg = {
  Time: async (msg) => {
    if (msg.author.bot) return;

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    if (!fs.existsSync('./time/time.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lTime = await tTime.time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: discord/time.js (msg)`);
      });

    const lServ = await tServer.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    const StripMsg = env.stripMsg;

    const DiscordGif = env.discordgif;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'test') {

      if (!args.length) {
        if (myLang === 'en') {
          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: add / list / del', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', DiscordGif);
          return msg.channel.send({ embeds: [embed] });
        }
        else

        if (myLang === 'uk') {
          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Time')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Додайте: add / list / del', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', DiscordGif);
          return msg.channel.send({ embeds: [embed] });
        }
      }

      if (args[0] === 'time') {

        if (args[1] === 'add') {

          if (!args[2]) {
            if (myLang === 'en') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: 'Add the number of hours.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              return msg.channel.send({ embeds: [embed] });
            }
            else

            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Додайте кількість годин.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          if (isNaN(args[2])) {
            if (myLang === 'en') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: 'Specify the hours in numbers.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              return msg.channel.send({ embeds: [embed] });
            }
            else

            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: 'Вкажіть години цифрами.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              return msg.channel.send({ embeds: [embed] });
            }
          }

          if (!lTime) {
            const create = await tTime.time.create({
              name: 'time',
              hours: `${args[2]}`,
            });

            if (create) {
              if (myLang === 'en') {
                const embed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Time')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Created time', value: `${moment().utc().locale('en').add(create.hours, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                    { name: 'Added hours', value: `${args[1]}` || '0', inline: false },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', DiscordGif);
                msg.channel.send({ embeds: [embed] });
              }
              else

              if (myLang === 'uk') {
                const embed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Time')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Створений час', value: `${moment().utc().locale('uk').add(create.hours, 'h').format('hh:mm a, dddd D MMMM, YYYY')}` || '0', inline: true },
                    { name: 'Додані години', value: `${args[1]}` || '0', inline: false },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', DiscordGif);
                msg.channel.send({ embeds: [embed] });
              }
            }
          }
          else if (lTime) {
            const update = await tTime.time.update({
              hours: `${args[2]}`,
            }, {
              where: {
                name: 'time',
              },
            });
            if (update) {
              if (myLang === 'en') {
                const embed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Time')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Updated time', value: `${moment().utc().locale('en').add(args[1], 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
                    { name: 'Added hours', value: `${args[1]}`, inline: false },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', DiscordGif);
                msg.channel.send({ embeds: [embed] });
              }
              else

              if (myLang === 'uk') {
                const embed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Time')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Оновлений час', value: `${moment().utc().locale('uk').add(args[1], 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
                    { name: 'Додані години', value: `${args[1]}`, inline: false },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', DiscordGif);
                msg.channel.send({ embeds: [embed] });
              }
            }
          }
        }

        if (args[1] === 'list') {
          const lTimes = await tTime.time.findAll({ attributes: ['hours'] });
          const strTime = lTimes.map(t => t.hours).join(' ') || '0';

          if (myLang === 'en') {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Time', value: `${moment().utc().locale('en').add(strTime, 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
                { name: 'Added hours', value: `${strTime}`, inline: false },
              )
              .setImage(StripMsg)
              .setFooter('Discord', DiscordGif);
            msg.channel.send({ embeds: [embed] });
          }
          else

          if (myLang === 'uk') {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Time')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Час', value: `${moment().utc().locale('uk').add(`${strTime}` || 0, 'h').format('hh:mm a, dddd D MMMM, YYYY')}`, inline: true },
                { name: 'Додані години', value: `${strTime}`, inline: false },
              )
              .setImage(StripMsg)
              .setFooter('Discord', DiscordGif);
            msg.channel.send({ embeds: [embed] });
          }
        }

        if (args[1] === 'del') {
          const destroy = await tTime.time.destroy({
            where: {
              name: 'time',
            },
          });

          if (destroy) {
            if (myLang === 'en') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Time has been deleted.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              msg.channel.send({ embeds: [embed] });
            }
            else

            if (myLang === 'uk') {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Time')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Вітаю!', value: 'Час був видалений.', inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', DiscordGif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }
      }
    }
  },
};
