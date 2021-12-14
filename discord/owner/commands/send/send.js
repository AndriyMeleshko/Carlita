const tServer = require('../../../../discord/main/server/server.js');

const Sequelize = require('sequelize');

const env = process.env;

const { Client, Intents, MessageEmbed } = require('discord.js');

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
  storage: './discord/owner/commands/send/send.sqlite',
});

const send = sequelize.define('send', {
  codename: Sequelize.TEXT,
  channelsendid: Sequelize.STRING,
  msgid: Sequelize.STRING,
  channelname: Sequelize.STRING,
  channelid: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
});

send.sync();

module.exports = { send };

module.exports.msg = {
  Send: async (msg) => {

    if (msg.author.bot) return;

    const lServ = await tServer.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    const owner = msg.member.id === env.ownerDiscordId;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const StripMsg = env.stripMsg;

    if (command === 'send') {

      if (owner) {

        const args1l = args.slice(1).join(' ');
        const args2l = args.slice(2).join(' ');

        if (!args.length) {

          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Send')
            .addFields(
              { name: '\u200B', value: '\u200B', inline: true },
              { name: '\u200B', value: '\u200B', inline: true },
              { name: 'Warning!', value: 'Add: emb <ID> <Content> / <ID> <Content>', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [embed] });
        }

        if (args[0] === 'emb' || args[0] === 'e') {

          if (!args[1]) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<ID> <Content>', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [embed] });
          }

          if (!`${args2l}`) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<Content>', inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [embed] });
          }

          const create = await send.create({
            codename: 'send',
            msgid: `${msg.id}`,
            channelsendid: `${args[1]}`,
            channelname: `${msg.channel.name}`,
            channelid: `${msg.channel.id}`,
            guildname: `${msg.guild.name}`,
            guildid: `${msg.guild.id}`,
          });

          if (create) {

            const lSends = await send.findAll({ attributes: [
              'channelsendid',
            ], where: {
              codename: 'send',
              msgid: `${msg.id}`,
            } });

            if (!lSends) return;

            const channelsendid = lSends.map(l => l.channelsendid);

            const channel = clientDiscord.channels.cache.get(`${channelsendid}`);

            if (!channel) return;

            const embed = new MessageEmbed()
              .setAuthor('Discord ', '', 'https://discord.com/')
              // .setDescription(`${args2l}`)
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: `${args2l}`, inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            const channelsend = channel.send({ embeds: [embed] });

            if (channelsend) {
              await send.destroy({ where: {
                codename: 'send',
                guildid: `${msg.guild.id}`,
              } });
            }
          }
        }
        else

        if (args[0] === 'list' || args[0] === 'l') {

          const lSends = await send.findAll({ attributes: [
            'codename',
            'channelsendid',
            'msgid',
            'channelname',
            'channelid',
            'guildname',
            'guildid',
          ], where: { guildid: `${msg.guild.id}` } });

          const channelsendid = lSends.map(l => l.channelsendid).join('\n') || '0';

          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Send')
            .addFields(
              { name: '\u200B', value: '\u200B', inline: true },
              { name: 'Channel Send ID', value: `${channelsendid}`, inline: true },
              { name: '\u200B', value: '\u200B', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [embed] });
        }
        else {

          if (!args[0]) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<ID> <Content>', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [embed] });
          }

          if (!`${args1l}`) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<Content>', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [embed] });
          }

          const create = await send.create({
            codename: 'send',
            msgid: `${msg.id}`,
            channelsendid: `${args[0]}`,
            channelname: `${msg.channel.name}`,
            channelid: `${msg.channel.id}`,
            guildname: `${msg.guild.name}`,
            guildid: `${msg.guild.id}`,
          });

          if (create) {

            const lSends = await send.findAll({ attributes: [
              'channelsendid',
            ], where: {
              codename: 'send',
              msgid: `${msg.id}`,
            } });

            if (!lSends) return;

            const channelsendid = lSends.map(l => l.channelsendid);

            const channel = clientDiscord.channels.cache.get(`${channelsendid}`);

            if (!channel) return;

            const channelsend = channel.send(`${args1l}`);

            if (channelsend) {
              await send.destroy({ where: {
                codename: 'send',
                guildid: `${msg.guild.id}`,
              } });
            }
          }
        }
      }
    }
  },
};

clientDiscord.login(env.clientDiscordToken);
