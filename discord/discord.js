console.log('file discord');

const tStatus = require('../discord/owner/status/status.js');

const fs = require('fs');

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

clientDiscord.once('ready', async () => {
  if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

  require('../discord/owner/status/status.js');

  const lStatus = await tStatus.status.findOne({ where: { title: 'status' } });

  if (lStatus) {
    if (lStatus.name) {
      if (!lStatus.type) {
        clientDiscord.user.setPresence({ activities: [{ name: `${lStatus.name}` }], status: `${lStatus.status}` });
      }
      else
      if (lStatus.type === 'STREAMING') {
        clientDiscord.user.setPresence({ activities: [{ name: `${lStatus.name}`, type: `${lStatus.type}`, url: `${lStatus.url}` }], status: `${lStatus.status}` });
      }
      else
      if (lStatus.type === 'LISTENING' || lStatus.type === 'WATCHING' || lStatus.type === 'COMPETING') {
        clientDiscord.user.setPresence({ activities: [{ name: `${lStatus.name}`, type: `${lStatus.type}` }], status: `${lStatus.status}` });
      }
    }

    setInterval(async () => {
      const lStat = await tStatus.status.findOne({ where: { title: 'status' } });

      if (lStat.name) {
        if (!lStat.type) {
          clientDiscord.user.setPresence({ activities: [{ name: `${lStat.name}` }], status: `${lStat.status}` });
        }
        else
        if (lStat.type === 'STREAMING') {
          clientDiscord.user.setPresence({ activities: [{ name: `${lStat.name}`, type: `${lStat.type}`, url: `${lStat.url}` }], status: `${lStat.status}` });
        }
        else
        if (lStat.type === 'LISTENING' || lStat.type === 'WATCHING' || lStat.type === 'COMPETING') {
          clientDiscord.user.setPresence({ activities: [{ name: `${lStat.name}`, type: `${lStat.type}` }], status: `${lStat.status}` });
        }
      }
    }, 10000);
  }

  if (fs.existsSync('./discord/main/server/server.js')) {
    if (env.server === 'on') {
      require('../discord/main/server/server.js');

      const server = require('../discord/main/server/server.js');
      server.ready.Server();
    }
    else {
      console.log('Disabled File: ./discord/main/server/server.js');
    }
  }
  else {
    console.log('Missing File: ./discord/main/server/server.js');
  }

  module.exports.server = { guild: clientDiscord.guilds.cache.map(guild => guild) };

  module.exports.client = { carlita: clientDiscord.user.id };

  require('../discord/admin/own/own.js');

  require('../discord/main/bearer/bearer.js');

  require('../discord/main/defcom/defcom.js');

  require('../discord/main/roles/roles.js');

  require('../discord/owner/test/own.js');

  const roles = require('../discord/main/roles/roles.js');
  roles.ready.Roles();
});

clientDiscord.on('messageCreate', async (msg) => {
  if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

  if (msg.author.bot) return;

  const time = require('../time/time.js');
  time.msg.Time(msg);

  // admin
  const embeds = require('../discord/admin/commands/commands.js');
  embeds.msg.Embed(msg);

  const own = require('../discord/admin/own/own.js');
  own.msg.Own(msg);

  // general
  const commands = require('../discord/general/commands.js');
  commands.msg.Commands(msg);

  // main
  const bearer = require('../discord/main/bearer/bearer.js');
  bearer.msg.Bearer(msg);

  const defcom = require('../discord/main/defcom/defcom.js');
  defcom.msg.Commands (msg);

  const server = require('../discord/main/server/server.js');
  server.msg.Server(msg);

  // owner
  const testOwn = require('../discord/owner/test/own.js');
  testOwn.msg.Own(msg);

  const send = require('../discord/owner/send/send.js');
  send.msg.Send(msg);

  const status = require('../discord/owner/status/status.js');
  status.msg.Status(msg);

  const webhook = require('../discord/owner/webhooks/webhook.js');
  webhook.msg.Webhook(msg);
});

clientDiscord.on('messageCreate', async (msg) => {
  if (msg.channel.type === 'GUILD_NEWS') {
    msg.crosspost()
      .then(() => console.log('Crossposted message'))
      .catch(console.error);
  }

  if (msg.author.bot) return;

  const attachment = await msg.attachments;
  attachment.map(async attach => {
    console.log(attach.url);
  });

  /* const filter = m => m.content.startsWith('!vote');
  msg.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
    .then(collected => console.log(collected.size))
    .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
    */
});

clientDiscord.login(env.clientDiscordToken);
