const app = require('../../app.json');

const Twitch = require(`../../../${app.Twitch[3].twitchjs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

module.exports.msg = {
	Commands: async (channel, userstate, message, self) => {

		if (self) return;

		const lChannel = await tables.channel.findOne({ where: {
			ChannelName: `${channel}`,
		} });

		if (!lChannel) return;

		const myPref = `${lChannel.ChannelPrefix}`;
		// const myLang = `${lChannel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		if (command === 'test') {
			Twitch.client.say(channel, `/me Test ${userstate['display-name']} Ok`);
		}
	},
};
