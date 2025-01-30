const weather = require('weather-js');

const app = require('../../app.json');

const Twitch = require(`../../../${app.Twitch[3].twitchjs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

module.exports.chat = {
	Chat: async (channel, userstate, message, self) => {
		if (self) return;

		async function safeDBQuery(query) {
			try {
				return await query();
			}
			catch (error) {
				console.error('File: chat.js / Помилка бази даних:', error);
				return null;
			}
		}

		const Channel = await safeDBQuery(() => tables.channel.findOne({ where: { ChannelName: `${channel}` } }));

		const myPref = `${Channel.ChannelPrefix}`;
		const myLang = `${Channel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		switch (command) {
		case 'ban':
			handleBanCommand();
			break;
		case 'ping':
			handlePingCommand();
			break;
		case 'weather':
			handleWeatherCommand();
			break;
		}

		async function handleBanCommand() {
			if (!args.length) {
				switch (myLang) {
				case 'en':
					sendMessage(`Congratulations ${userstate['display-name']}, you have received a BAN`);
					break;
				case 'uk':
					sendMessage(`Вітаю ${userstate['display-name']}, ви отримали BAN`);
					break;
				}
				return;
			}
			switch (myLang) {
			case 'en':
				sendMessage(`Congratulations ${args.join(' ')} you have received a BAN`);
				break;
			case 'uk':
				sendMessage(`Вітаю ${args.join(' ')} ви отримали BAN`);
				break;
			}
		}

		async function handlePingCommand() {
			Twitch.client.ping()
				.then((data) => {
					switch (myLang) {
					case 'en':
						sendMessage(`${data}s`);
						break;
					case 'uk':
						sendMessage(`${data}сек`);
						break;
					}
				})
				.catch(err => console.error(err));
		}

		async function handleWeatherCommand() {
			const listUk = [
				'Кохайтеся, чорнобриві, Та не з м***ми,Бо м***лі — чужі люде, Роблять лихо з вами. М***ль любить жартуючи, Жартуючи кине, Піде в свою Московщину, А дівчина гине... (Т.Г. Шевченко)',
				'Щоб лани широкополі, і Дніпро і кручі, стали вам поперек горла, м***лі Ї***чі. (Заповіт - АТО Кіборги)',
				'Отак подивишся здаля на м***ля - неначе справді він людина: іде собі як сиротина, очима - блим, губами - плям, і десь трапляється хвилина - його буває навіть жаль. А ближче підійдеш - скотина. (Т.Г. Шевченко)',
			];

			const indexUk = Math.floor(Math.random() * listUk.length);

			switch (myLang) {
			case 'en':
				if (!args.length) {
					sendMessage('Specify the city');
					return;
				}

				weather.find({ search: `${args.join(' ')}`, lang: 'en-US', degreeType: 'F' }, async (error, result) => {

					if (!error) {
						if (result[0] === undefined || result.length === 0) {
							sendMessage('I don\'t know this city');
							return;
						}

						const location = result[0].location;
						const current = result[0].current;
						const point = current.observationpoint;

						if (point.includes('Russia') || point.includes('совет')) {
							sendMessage(`${listUk[indexUk]}`);
							return;
						}
						else {
							sendMessage(`${location.name}: ${current.skytext}, Humidity: ${current.humidity}%, Wind: ${current.winddisplay}, Temperature: ${current.temperature}°${location.degreetype}`);
						}
					}
					else if (error) {
						if (!result) {
							sendMessage('An error occurred while retrieving the result');
							return;
						}
						console.error(error);
					}
				});
				break;
			case 'uk': {
				if (!args.length) {
					sendMessage('Вкажіть місто');
					return;
				}

				weather.find({ search: `${args.join(' ')}`, lang: 'uk-UA', degreeType: 'C' }, async (error, result) => {

					if (!error) {
						if (result[0] === undefined || result.length === 0) {
							sendMessage('Мені не відоме це місто');
							return;
						}

						const location = result[0].location;
						const current = result[0].current;
						const point = current.observationpoint;

						if (point.includes('Russia') || point.includes('совет')) {
							sendMessage(`${listUk[indexUk]}`);
							return;
						}
						else {
							sendMessage(`${location.name}: ${current.skytext}, Вологість: ${current.humidity}%, Вітер: ${current.winddisplay}, Температура: ${current.temperature}°${location.degreetype}`);
						}
					}
					else if (error) {
						if (!result) {
							sendMessage('Сталася помилка під час отримання результату');
							return;
						}
						console.error(error);
					}
				});
			}
				break;
			}
		}

		function sendMessage(msg) {
			Twitch.client.say(channel, `/me ${msg}`);
		}
	},
};
