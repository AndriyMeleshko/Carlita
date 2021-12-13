const tTime = require('../time/time.js');
const tServ = require('../discord/main/server/server.js');
const tStatus = require('../discord/owner/status/status.js');

const fs = require('fs');
const moment = require('moment');
// const fetch = require('node-fetch');

const env = process.env;

setTimeout(async () => {

  if (fs.existsSync('./time/time.sqlite')) {

    const lTime = await tTime.time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: discord.js`);
      });

    if (lTime) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | File: discord.js`);
    }
  }
});

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

clientDiscord.once('ready', async (ready) => {

  /* fetch('https://discord.com/api/guilds/767512231063191553/widget.json')
    .then(response => response.json())
    .then(async (Stream) => {
      console.log(Stream);
    }); */

  if (fs.existsSync('./time/time.sqlite')) {

    const lTime = await tTime.time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: discord.js (ready)`);
      });

    if (lTime) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | File: discord.js (ready) | ${ready.user.username} #${ready.user.discriminator}`);
    }
  }

  module.exports.server = { guild: clientDiscord.guilds.cache.map(guild => guild) };

  module.exports.client = { carlita: clientDiscord.user.id };

  /* setInterval(async () => {
    fetch('http://api.open-notify.org/iss-now.json')
      .then(response => response.json())
      .then(async (jsonISS) => {
        clientDiscord.user.setPresence({ activities: [{ name: `ISS: UNIX: ${jsonISS.timestamp}`, type: 2 }] });
      })
      .catch(err => console.error(err))
  }, 5 * 1000); */

  setTimeout(async () => clientDiscord.user.setStatus('idle'), 300 * 1000);

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
    }, 10 * 1000);
  }

  // Admin
  require('../discord/admin/commands/rules/rules.js');
  require('../discord/admin/own/own.js');

  const live = require('../discord/admin/twitch/live.js');
  live.ready.Live();

  // Main
  require('../discord/main/bearer/bearer.js');

  require('../discord/main/defcom/defcom.js');

  require('../discord/main/roles/roles.js');

  const roles = require('../discord/main/roles/roles.js');
  roles.ready.Roles();

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

  // Owner
  if (fs.existsSync('./discord/owner/test/own.js')) {
    if (env.testown === 'on') {
      require('../discord/owner/test/own.js');
    }
    else {
      console.log('Disabled File: ./discord/owner/test/own.js');
    }
  }
  else {
    console.log('Missing File: ./discord/owner/test/own.js');
  }

  require('../discord/owner/commands/send/send.js');
});

process.on('unhandledRejection', async (error) => {

  console.error('Unhandled promise rejection:', error);
});

clientDiscord.on('error', async (error) => {

  console.error(error);
});

clientDiscord.on('interactionCreate', async (interaction) => {

  const rulesButton = require('../discord/admin/commands/rules/rules.js');
  rulesButton.interaction.RuleButton(interaction);

  const rulesMenu = require('../discord/admin/commands/rules/rules.js');
  rulesMenu.interaction.RuleMenu(interaction);

  const server = require('../discord/main/server/server.js');
  server.interaction.ServerMenu(interaction);
});

clientDiscord.on('messageCreate', async (msg) => {
  if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

  if (msg.author.bot) return;

  // Admin
  const embeds = require('../discord/admin/commands/commands.js');
  embeds.msg.Embed(msg);

  const rules = require('../discord/admin/commands/rules/rules.js');
  rules.msg.Rule(msg);

  const own = require('../discord/admin/own/own.js');
  own.msg.Own(msg);

  const live = require('../discord/admin/twitch/live.js');
  live.msg.Live(msg);

  // General
  const generalCommands = require('../discord/general/commands.js');
  generalCommands.msg.Commands(msg);

  // Main
  const bearer = require('../discord/main/bearer/bearer.js');
  bearer.msg.Bearer(msg);

  const defcom = require('../discord/main/defcom/defcom.js');
  defcom.msg.Commands (msg);

  const server = require('../discord/main/server/server.js');
  server.msg.Server(msg);

  // Owner
  const commands = require('../discord/owner/commands/commands.js');
  commands.msg.Commands(msg);

  const send = require('../discord/owner/commands/send/send.js');
  send.msg.Send(msg);

  const time = require('../discord/owner/commands/time/time.js');
  time.msg.Time(msg);

  const status = require('../discord/owner/status/status.js');
  status.msg.Status(msg);

  const webhook = require('../discord/owner/webhooks/webhook.js');
  webhook.msg.Webhook(msg);

  // Owner Test
  const testCommands = require('../discord/owner/test/commands.js');
  testCommands.msg.Commands(msg);

  const testOwn = require('../discord/owner/test/own.js');
  testOwn.msg.Own(msg);
});

clientDiscord.on('messageCreate', async (msg) => {

  if (msg.channel.type === 'GUILD_NEWS') {
    msg.crosspost()
      .then(() => console.log(`Channel: #${msg.channel.name} Crossposted message`))
      .catch(console.error);
  }

  if (msg.author.bot) return;

  const attachment = await msg.attachments;
  attachment.map(async attach => {
    console.log(attach.url);
  });

  const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });

  const myPref = `${lServ.guildprefix}`;

  if (!msg.content.startsWith(myPref)) return;
  const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command) {
    clientDiscord.user.setStatus('online');
    // if (statusOnline) console.log('Status: ONLINE (msg)');
    setTimeout(async () => {
      clientDiscord.user.setStatus('idle');
      // if (statusIdle) console.log('Status: IDLE (msg)');
    }, 300 * 1000);
  }

  // const filter = m => m.content.startsWith('!vote');
  // msg.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
  // .then(collected => console.log(collected.size))
  // .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
});

clientDiscord.on('guildCreate', async (guild) => {

  const lTime = await tTime.time.findOne({ where: { name: 'time' } })
    .catch(err => {
      console.error(`${err.original} | File: discord.js (guildCreate)`);
    });

  const lServ = await tServ.server.findOne({ where: { guildid: `${guild.id}` } });

  if (!lServ) {
    const create = await tServ.server.create({
      name: 'server',
      guildname: `${guild.name}`,
      guildid: `${guild.id}`,
      guildprefix: `${env.prefix}`,
      guildlanguage: 'en',
    });
    if (create) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Discord | New Server: ${create.guildname} | ID: ${create.guildid} | Prefix: ${create.guildprefix} | Language: ${create.guildlanguage}`);
    }
  }
});

clientDiscord.on('guildDelete', async (guild) => {

  const lTime = await tTime.time.findOne({ where: { name: 'time' } })
    .catch(err => {
      console.error(`${err.original} | File: discord.js (guildDelete)`);
    });

  const lServ = await tServ.server.findOne({ where: { guildid: `${guild.id}` } });

  if (lServ) {
    const destroy = await tServ.server.destroy({ where: {
      guildid: `${guild.id}`,
    },
    });
    if (destroy) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Discord | Destroy Server: ${guild.name} | ID: ${guild.id} | Prefix: ${lServ.guildprefix} | Language: ${lServ.guildlanguage}`);
    }
  }
});

clientDiscord.login(env.clientDiscordToken);
