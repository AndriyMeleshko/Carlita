const tServ = require('../../../discord/main/server/server.js');

const { MessageEmbed } = require('discord.js');
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

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const owner = msg.member.id === env.ownerdiscordid;
    if (!owner) return;

    if (command === 'msg') {
      msg.delete();

      if (!args.length) {
        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Message')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: text', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Message')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Додайте: text', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      msg.channel.send(`${args.join(' ')}`);
    }

    if (command === 'msge') {
      msg.delete();

      const commandArgs = args.join(' ');
      const splitArgs = commandArgs.split(' ');
      const tagName = splitArgs.shift();
      const tagDescription = splitArgs.join(' ');

      if (!args.length) {
        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Message')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add:\nurl (.jpg .jpeg .png .gif)\ntext\nurl text', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Message')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Додайте:\nurl (.jpg .jpeg .png .gif)\ntext\nurl text', inline: true },
              { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      if (tagName.endsWith('.jpg') || tagName.endsWith('.JPG') ||
            tagName.endsWith('.jpeg') || tagName.endsWith('.JPEG') ||
            tagName.endsWith('.png') || tagName.endsWith('.PNG') ||
            tagName.endsWith('.gif') || tagName.endsWith('.GIF')) {
        if (!tagDescription) {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setImage(tagName)
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }
        else {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription(tagDescription)
            .setImage(tagName)
            .setTimestamp()
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }
      }
      else {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription(args.join(' '))
          .setTimestamp()
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }
    }
  },
};
