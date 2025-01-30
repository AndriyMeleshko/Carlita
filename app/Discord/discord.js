console.log('Running file: discord.js');

const moment = require('moment');
const fs = require('fs');

const app = require('../app.json');
const env = process.env;

const { Client, GatewayIntentBits, Partials, Events, PermissionsBitField } = require('discord.js');

const ClientDiscord = new Client({
	intents: [
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
	ws: { intents: [
		'AutoModerationConfiguration',
		'AutoModerationExecution',
		'DirectMessageReactions',
		'DirectMessageTyping',
		'DirectMessages',
		'GuildBans',
		'GuildEmojisAndStickers',
		'GuildIntegrations',
		'GuildInvites',
		'GuildMembers',
		'GuildMessageReactions',
		'GuildMessageTyping',
		'GuildMessages',
		'GuildModeration',
		'GuildPresences',
		'GuildScheduledEvents',
		'GuildVoiceStates',
		'GuildWebhooks',
		'Guilds',
		'MessageContent',
	] },
});

/* process.on('warning', (warning) => {
  console.log('Повідомлення про попередження:', warning.message);
}); */

// Подія beforeExit
process.on('beforeExit', () => console.log('beforeExit event'));
// Подія exit з кодом ${code}
process.on('exit', (code) => console.log(`exit event with code ${code}`));
// Неперехоплене виключення:
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
// Неперехоплене відхилення обіцянки
// process.on('unhandledRejection', (reason, promise) => console.error('Unhandled Rejection at:', promise, 'reason:', reason));
// Попередження:
// process.on('warning', (warning) => console.warn('Warning:', warning));
// Отримано сигнал SIGINT
// process.on('SIGINT', () => console.log('Received SIGINT signal'));
// Отримано сигнал SIGUSR1
process.on('SIGUSR1', () => console.log('Received SIGUSR1 signal'));
// Отримано сигнал SIGUSR2
process.on('SIGUSR2', () => console.log('Received SIGUSR2 signal'));
// Отримано сигнал SIGTERM
process.on('SIGTERM', () => console.log('Received SIGTERM signal'));
// Отримано повідомлення від батька:
process.on('message', (message) => console.log('Received message from parent:', message));

// Помилка WebSocket:
ClientDiscord.on('error', (error) => console.error('WebSocket error:', error));

ClientDiscord.once(Events.ClientReady, async (c) => {
	console.log(`Client Discord Ready: ${c.user.username} #${c.user.discriminator}`);
	// ${c.user.tag}

	module.exports.ready = {
		servers: ClientDiscord.guilds.cache.map(guild => guild),
		// status: ClientDiscord.users.cache.map(user => user),
		carlita: ClientDiscord.user.id,
	};

	// Commands

	if (env.alerts === 'on' && fs.existsSync(`./${app.Discord[0].alertsjs}`)) {
		const alerts = require(`../../${app.Discord[0].alertsjs}`);
		alerts.ready.Alerts(ClientDiscord);
	}

	if (env.commandsjs === 'on' && fs.existsSync(`./${app.Discord[0].commandsjs}`)) {
		require(`../../${app.Discord[0].commandsjs}`);
	}

	if (env.number === 'on' && fs.existsSync(`./${app.Discord[0].numberjs}`)) {
		require(`../../${app.Discord[0].numberjs}`);
	}

	if (env.live === 'on' && fs.existsSync(`./${app.Twitch[0].livejs}`)) {
		const live = require(`../../${app.Twitch[0].livejs}`);
		live.ready.Live(ClientDiscord);
	}

	// System

	if (env.servers === 'on' && fs.existsSync(`./${app.Discord[2].serversjs}`)) {
		const servers = require(`../../${app.Discord[2].serversjs}`);
		servers.ready.Servers();
	}

	if (env.status === 'on' && fs.existsSync(`./${app.Discord[2].statusjs}`)) {
		const status = require(`../../${app.Discord[2].statusjs}`);
		status.ready.Status(ClientDiscord);
	}
});

ClientDiscord.on(Events.GuildScheduledEventUpdate, async (event) => {
	// Отримуємо поточний час та дату без урахування секунд
	const momentTime = moment().format('YYYY-MM-DDTHH:mm:00');

	// Перетворюємо event.scheduledStartTimestamp в об'єкт moment і видаляємо секунди
	const scheduledStart = moment(event.scheduledStartTimestamp).format('YYYY-MM-DDTHH:mm:00');

	// Тепер ви можете порівняти scheduledStart та motime
	if (moment(scheduledStart).isSame(momentTime)) {
		// console.log('Час рівний без урахування секунд');
		const guild = ClientDiscord.guilds.cache.get(env.EventsServerId);
		const channel = guild.channels.cache.get(env.EventsChannelId);
		await channel.send(`[event.name](${event.url})`);
	}
	else {
		// console.log('Час не рівний');
	}
});

ClientDiscord.on(Events.InteractionCreate, async (interaction) => {
	// Commands

	if (env.terms === 'on' && fs.existsSync(`./${app.Discord[0].termsjs}`)) {
		const terms = require(`../../${app.Discord[0].termsjs}`);
		terms.interaction.TermsMenu(interaction);
		terms.interaction.TermsButton(interaction);
	}

	// System

	if (env.servers === 'on' && fs.existsSync(`./${app.Discord[2].serversjs}`)) {
		const servers = require(`../../${app.Discord[2].serversjs}`);
		servers.interaction.Servers(interaction);
	}
});

ClientDiscord.on(Events.MessageCreate, async (msg) => {
	if (msg.author.bot || !msg.guild) return;

	const owner = msg.author.id === env.OwnerDiscordId;
	const administrator = msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

	if (owner) {
		const attachment = await msg.attachments;
		attachment.map(async attach => console.log(attach.url));
	}

	// Commands

	if (owner || administrator) {
		if (env.alerts === 'on' && fs.existsSync(`./${app.Discord[0].alertsjs}`)) {
			const alerts = require(`../../${app.Discord[0].alertsjs}`);
			alerts.msg.Alerts(msg, ClientDiscord);
		}

		if (env.greet === 'on' && fs.existsSync(`./${app.Discord[0].greetjs}`)) {
			const greet = require(`../../${app.Discord[0].greetjs}`);
			greet.msg.Greet(msg);
		}

		if (env.terms === 'on' && fs.existsSync(`./${app.Discord[0].termsjs}`)) {
			const terms = require(`../../${app.Discord[0].termsjs}`);
			terms.msg.Terms(msg);
		}

		if (env.live === 'on' && fs.existsSync(`./${app.Twitch[0].livejs}`)) {
			const live = require(`../../${app.Twitch[0].livejs}`);
			live.msg.Live(msg, ClientDiscord);
		}
	}

	if (env.number === 'on' && fs.existsSync(`./${app.Discord[0].numberjs}`)) {
		const number = require(`../../${app.Discord[0].numberjs}`);
		number.msg.Number(msg);
	}

	if (env.commandsjs === 'on' && fs.existsSync(`./${app.Discord[0].commandsjs}`)) {
		const commands = require(`../../${app.Discord[0].commandsjs}`);
		commands.msg.Commands(msg);
	}

	// System

	if (owner) {
		if (env.bearer === 'on' && fs.existsSync(`./${app.Twitch[2].bearerjs}`)) {
			const bearer = require(`../../${app.Twitch[2].bearerjs}`);
			bearer.msg.Bearer(msg);
		}

		if (env.servers === 'on' && fs.existsSync(`./${app.Discord[2].serversjs}`)) {
			const servers = require(`../../${app.Discord[2].serversjs}`);
			servers.msg.Servers(msg);
			servers.msg.Prefix(msg);
			servers.msg.Language(msg);
		}

		if (env.status === 'on' && fs.existsSync(`./${app.Discord[2].statusjs}`)) {
			const status = require(`../../${app.Discord[2].statusjs}`);
			status.msg.Status(msg);
		}

		if (env.send === 'on' && fs.existsSync(`./${app.Discord[2].sendjs}`)) {
			const send = require(`../../${app.Discord[2].sendjs}`);
			send.msg.Send(msg, ClientDiscord);
		}

		/* if (env.time === 'on' && fs.existsSync(`./${app.Time[0].timejs}`)) {
      const time = require(`../../${app.Time[0].timejs}`);
      time.msg.Time(msg);
    } */
	}

	if (owner || administrator) {
		if (env.servers === 'on' && fs.existsSync(`./${app.Discord[2].serversjs}`)) {
			const servers = require(`../../${app.Discord[2].serversjs}`);
			servers.msg.Servers(msg);
			servers.msg.Prefix(msg);
			servers.msg.Language(msg);
		}
	}
});

ClientDiscord.on(Events.GuildMemberAdd, async (member) => {
	if (env.greet === 'on' && fs.existsSync(`./${app.Discord[0].greetjs}`)) {
		const greet = require(`../../${app.Discord[0].greetjs}`);
		greet.add.Greet(member, ClientDiscord);
	}
});

/* ClientDiscord.on(Events.GuildMemberRemove, async (member) => {
  if (env.greet === 'on' && fs.existsSync(`./${app.Discord[0].greetjs}`)) {
    const remove = require(`../../${app.Discord[0].greetjs}`);
    remove.add.Remove(member, ClientDiscord);
  }
}); */

ClientDiscord.login(env.ClientDiscordToken);
