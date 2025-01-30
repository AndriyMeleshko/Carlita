const app = require('./app.json');

const { Sequelize, DataTypes } = require('sequelize');

// Discord

const SequelizeAlert = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[0].alertssq}`,
});

const alerts = SequelizeAlert.define('alerts', {
	CodeName: Sequelize.TEXT,
	ChannelName: Sequelize.STRING,
	ChannelId: Sequelize.STRING,
	GuildName: Sequelize.STRING,
	GuildId: Sequelize.STRING,

	/* MessageId: {
    type: DataTypes.JSON,
    allowNull: true,
  }, */
	MessageId: Sequelize.STRING,

	AlertID: Sequelize.STRING,
	LocationTitle: Sequelize.STRING,
	LocationType: Sequelize.STRING,
	LocationCity: Sequelize.STRING,
	LocationRegion: Sequelize.STRING,
	LocationCommunity: Sequelize.STRING,
	StartedAt: Sequelize.STRING,
	FinishedAt: Sequelize.STRING,
	AlertUpdatedAt: Sequelize.STRING,
	AlertType: Sequelize.STRING,
	LocationOblast: Sequelize.STRING,
	LocationUid: Sequelize.STRING,
	Notes: Sequelize.STRING,
	Calculated: Sequelize.STRING,
});

const SequelizeGreet = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[0].greetsq}`,
});

const greet = SequelizeGreet.define('greet', {
	CodeName: Sequelize.TEXT,
	ChannelName: Sequelize.STRING,
	ChannelId: Sequelize.STRING,
	GuildName: Sequelize.STRING,
	GuildId: Sequelize.STRING,
});

const SequelizeNumber = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[0].numbersq}`,
});

const number = SequelizeNumber.define('number', {
	CodeName: Sequelize.TEXT,
	Number: Sequelize.STRING,
	ChannelName: Sequelize.STRING,
	ChannelId: Sequelize.STRING,
	GuildId: Sequelize.STRING,
});

const SequelizeSend = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[2].sendsq}`,
});

const send = SequelizeSend.define('send', {
	codename: Sequelize.TEXT,
	channelsendid: Sequelize.STRING,
	msgid: Sequelize.STRING,
	channelname: Sequelize.STRING,
	channelid: Sequelize.STRING,
	guildname: Sequelize.STRING,
	guildid: Sequelize.STRING,
});

const SequelizeServer = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[2].serverssq}`,
});

const server = SequelizeServer.define('server', {
	CodeName: Sequelize.TEXT,
	GuildName: Sequelize.STRING,
	GuildId: Sequelize.STRING,
	GuildPrefix: Sequelize.STRING,
	GuildLanguage: Sequelize.STRING,
});

const SequelizeStatus = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Discord[2].statussq}`,
});

const status = SequelizeStatus.define('status', {
	CodeName: Sequelize.TEXT,
	Time: Sequelize.STRING,
});

// Time

const SequelizeTime = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Time[0].timesq}`,
});

const time = SequelizeTime.define('time', {
	CodeName: Sequelize.TEXT,
	Date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	Hours: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

// Twitch

const SequelizeLive = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Twitch[0].livesq}`,
});

const live = SequelizeLive .define('live', {
	CodeName: Sequelize.TEXT,
	Message: Sequelize.STRING,
	MessageId: Sequelize.STRING,
	ChannelName: Sequelize.STRING,
	ChannelId: Sequelize.STRING,
	RoleName: Sequelize.STRING,
	RoleId: Sequelize.STRING,
	GuildName: Sequelize.STRING,
	GuildId: Sequelize.STRING,

	Role: Sequelize.STRING,
	Game: Sequelize.STRING,

	RoleSwitch: Sequelize.STRING,
	CategorySwitch: Sequelize.STRING,
	GameSwitch: Sequelize.STRING,

	Send: Sequelize.STRING,
	Update: Sequelize.STRING,

	Image: Sequelize.STRING,

	History: Sequelize.STRING,
	Category: Sequelize.STRING,

	UserLogin: Sequelize.STRING,
	DisplayName: Sequelize.STRING,
	BroadcasterType: Sequelize.STRING,
	ProfileImageUrl: Sequelize.STRING,

	GameId: Sequelize.STRING,
	GameName: Sequelize.STRING,
	Type: Sequelize.STRING,
	Title: Sequelize.STRING,
	Tags: Sequelize.STRING,
	ViewerCount: Sequelize.STRING,
	StartedAt: Sequelize.STRING,
	Language: Sequelize.STRING,
	ThumbnailUrl: Sequelize.STRING,
	IsMature: Sequelize.STRING,

	BoxArtUrl: Sequelize.STRING,
});

const sequelizeBearer = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Twitch[2].bearersq}`,
});

const bearer = sequelizeBearer.define('bearer', {
	CodeName: Sequelize.TEXT,
	TimePlus: Sequelize.STRING,
	TimePlus2: Sequelize.STRING,
	AccessToken: Sequelize.STRING,
	RefreshToken: Sequelize.STRING,
	ExpiresIn: Sequelize.STRING,
	Scope: Sequelize.STRING,
	TokenType: Sequelize.STRING,
});

const sequelizeCategory = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Twitch[2].categorysq}`,
});

const category = sequelizeCategory.define('category', {
	CodeName: Sequelize.TEXT,
	ChannelName: Sequelize.STRING,
	Category: Sequelize.STRING,
	Status: Sequelize.STRING,
});

const sequelizeChannel = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Twitch[2].channelssq}`,
});

const channel = sequelizeChannel.define('channel', {
	CodeName: Sequelize.TEXT,
	ChannelName: Sequelize.STRING,
	ChannelPrefix: Sequelize.STRING,
	ChannelLanguage: Sequelize.STRING,
});

const SequelizeQuote = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: `./${app.Twitch[0].quotesq}`,
});

const quote = SequelizeQuote.define('Quote', {
	CodeName: Sequelize.TEXT,
	ChannelName: Sequelize.STRING,
	QuoteName: {
		type: Sequelize.STRING(200),
	},
	QuoteId: Sequelize.STRING,
});

alerts.sync();
greet.sync();
number.sync();
send.sync();
server.sync();
status.sync();

time.sync();

live.sync();
bearer.sync();
category.sync();
channel.sync();
quote.sync();

module.exports = { alerts, greet, number, send, server, status, time, live, bearer, category, channel, quote };
