const tServ = require('../../../discord/main/server/server.js');

// const fs = require('fs');

const env = process.env;

const { Client, Intents } = require('discord.js');

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

module.exports.msg = {
  Send: async (msg) => {
    if (msg.author.bot) return;

    msg.channel.send({ files: ['https://cdn.discordapp.com/attachments/891644815274545163/906113308376068096/Cruella.mp4'] });

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    const owner = msg.member.id === env.ownerDiscordId;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'send') {
      if (owner) {
        const args0 = args.slice(0, 1);
        const args1 = args.slice(1);

        if (!args.length) {
          return msg.channel.send('Add: emb / ID Content');
        }

        const channelsend = clientDiscord.channels.cache.get(`${args0}`);


        if (!channelsend) {
          console.log(channelsend);
          return msg.channel.send('Add a valid Channel ID.');
        }

        if (!`${args1}`) {
          return msg.channel.send('Add: Content');
        }
        else if (`${args1.join(' ')}`.includes('e:andriyko')) {
          const eandriyko = `${args1.join(' ')}`.replace(/e:andriyko/g, '<:Andriyko:891463041626030128>');
          return channelsend.send(`${eandriyko}`);
        }
        else if (`${args1.join(' ')}`.includes('e:run')) {
          const erun = `${args1.join(' ')}`.replace(/e:run/g, '<a:FallGuyRun:767523268469981235>');
          return channelsend.send(`${erun}`);
        }
        else {
          channelsend.send(args1.join(' '));
        }
      }
    }
  },
};
