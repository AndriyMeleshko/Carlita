const tServ = require('../../../discord/main/server/server.js');
const tCli = require('../../../discord/discord.js');

const { Permissions, MessageEmbed } = require('discord.js');
const fs = require('fs');

const env = process.env;

module.exports.msg = {
  Embed: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    const admin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const owner = msg.member.id === env.ownerdiscordid;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const StripMsg = env.stripMsg;

    const carlita = tCli.client.carlita;

    if (command === 'edit') {
      if (admin || owner) {
        msg.delete();

        const args1l = args.slice(1).join(' ');
        const args2l = args.slice(2).join(' ');

        // console.log(`${args[0]} | ${args1l}`);
        // console.log(`${args[0]} | ${args[1]} | ${args2l}`);

        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Edit')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: `Add:\nThe ID of the <@${carlita}> message you want to change and the new content of the message.\n\nThe ID of the <@${carlita}> message you want to change, the link (.jpg .jpeg .png .gif) and / or the new content of the message.`, inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
          else
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Edit')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: `Додайте:\nІдентифікатор повідомлення <@${carlita}> яке потрібно змінити та новий вміст повідомлення.\n\nІдентифікатор повідомлення <@${carlita}> яке потрібно змінити, посилання (.jpg .jpeg .png .gif) та/або новий вміст повідомлення.`, inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        msg.channel.messages.fetch(`${args[0]}`)
          .then((message) => {
            if (!args[1]) {
              if (myLang === 'en') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Edit')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Warning!', value: 'Add: New content.', inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                return msg.channel.send({ embeds: [exampleEmbed] });
              }
              else
              if (myLang === 'uk') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Edit')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Увага!', value: 'Додайте: Новий вміст.', inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                return msg.channel.send({ embeds: [exampleEmbed] });
              }
            }
            else
            if (args[1].endsWith('.jpg') || args[1].endsWith('.JPG') ||
                args[1].endsWith('.jpeg') || args[1].endsWith('.JPEG') ||
                args[1].endsWith('.png') || args[1].endsWith('.PNG') ||
                args[1].endsWith('.gif') || args[1].endsWith('.GIF')) {
              if (!`${args2l}`) {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setImage(`${args[1]}`)
                  .setTimestamp()
                  .setFooter('Discord', env.discordgif);
                message.edit({ embeds: [exampleEmbed] });
              }
              else if (`${args2l}`) {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription(`${args2l}`)
                  .setImage(`${args[1]}`)
                  .setTimestamp()
                  .setFooter('Discord', env.discordgif);
                message.edit({ embeds: [exampleEmbed] });
              }
            }
            else {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription(`${args1l}`)
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              message.edit({ embeds: [exampleEmbed] });
            }
          })
          .catch(err => {
            if (err.httpStatus === 404) {
              if (myLang === 'en') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Edit')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Warning!', value: 'Add: A valid message ID.', inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                return msg.channel.send({ embeds: [exampleEmbed] });
              }
              else
              if (myLang === 'uk') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Edit')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Увага!', value: 'Додайте: Дійсний ідентифікатор повідомлення.', inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                return msg.channel.send({ embeds: [exampleEmbed] });
              }
            }
            else {
              console.error(err);
            }
          });
      }
    }
  },
};
