const app = require('../../app.json');

const Twitch = require(`../../../${app.Twitch[3].twitchjs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

module.exports.msg = {
	Quote: async (channel, userstate, message, self) => {
		if (self) return;

		async function safeDBQuery(query) {
			try {
				return await query();
			}
			catch (error) {
				console.error('File: quote.js / Помилка бази даних:', error);
				return null;
			}
		}

		const Channel = await safeDBQuery(() => tables.channel.findOne({
			where: { ChannelName: `${channel}` } }));

		const myPref = `${Channel.ChannelPrefix}`;
		const myLang = `${Channel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).split(/ +/);
		const command = args.shift().toLowerCase();

		switch (command) {
		case 'quote':
		case 'q':
		case 'цитата':
		case 'ц':
			// Обробляємо команду "quote" або "цитата"
			handleQuoteCommand();
			// Перевіряємо аргументи, що стосуються команди "quote"
			switch (args[0]) {
			case 'add':
			case 'a':
				await handleAddQuote(args.slice(1).join(' '));
				return;
			case 'delete':
			case 'del':
			case 'd':
			case 'remove':
			case 'r':
				await handleDeleteQuote(args[1]);
				return;
			default:
				await handleQuoteArgs();
				break;
			}
			break;
			// Додавайте інші випадки команд, які ви хочете обробляти
			// case 'ім'я_команди':
			//     handleCustomCommand();
			//     break;
		default:
			// Виконується, якщо команда не відповідає жодному випадку
			break;
		}

		async function handleQuoteCommand() {
			const quote = await safeDBQuery(() => tables.quote.findOne({
				where: { CodeName: 'Quote', ChannelName: `${channel}` } }));

			const quotes = await safeDBQuery(() => tables.quote.findAll({
				attributes: ['CodeName', 'QuoteName'],
				where: { ChannelName: `${channel}` } }));

			if (!args.length && !quote) {
				switch (myLang) {
				case 'en':
					sendMessage('No quotes found');
					break;
				case 'uk':
					sendMessage('Цитати не знайдені');
					break;
				}
				return;
			}

			if (!args.length) {
				const quoteName = quotes.map(item => item.QuoteName);
				const randomIndex = Math.floor(Math.random() * quoteName.length);
				sendMessage(quoteName[randomIndex]);
			}
		}

		async function handleQuoteArgs() {
			// args[0] не є числом
			if (args[0] && isNaN(args[0])) {
				switch (myLang) {
				case 'en':
					sendMessage('Enter the quote number');
					break;
				case 'uk':
					sendMessage('Вкажіть номер цитати');
					break;
				}
				return;
			}

			// args[0] є числом
			if (args[0] && !isNaN(args[0])) {
				const quoteNumber = await safeDBQuery(() => tables.quote.findOne({
					where: { CodeName: 'Quote', ChannelName: `${channel}`, id: `${args[0]}` } }));

				if (!quoteNumber) {
					switch (myLang) {
					case 'en':
						sendMessage(`Quote ${args[0]} not found`);
						break;
					case 'uk':
						sendMessage(`Цитата ${args[0]} не знайдена`);
						break;
					}
					return;
				}
				sendMessage(`${quoteNumber.QuoteName}`);
			}
		}

		async function handleAddQuote(quoteName) {
			const broadcaster = userstate.badges.broadcaster === '1';
			const moderator = userstate.badges.moderator === '1';
			const vip = userstate.badges.vip === '1';

			if (broadcaster || moderator || vip) {
				if (!quoteName) {
					switch (myLang) {
					case 'en':
						sendMessage('Add a quote');
						break;
					case 'uk':
						sendMessage('Додайте цитату');
						break;
					}
					return;
				}

				const quote = await safeDBQuery(() => tables.quote.findOne({
					where: { CodeName: 'Quote', ChannelName: `${channel}`, QuoteName: `${quoteName}` } }));

				if (quote) {
					switch (myLang) {
					case 'en':
						sendMessage('Such a quote already exists');
						break;
					case 'uk':
						sendMessage('Така цитата вже існує');
						break;
					}
					return;
				}

				const maxMessageLength = 200;

				if (quoteName.length > maxMessageLength) {
					switch (myLang) {
					case 'en':
						sendMessage('The quote is too long');
						break;
					case 'uk':
						sendMessage('Цитата занадто довга');
						break;
					}
					return;
				}

				const create = await safeDBQuery(() => tables.quote.create({
					CodeName: 'Quote',
					ChannelName: `${channel}`,
					QuoteName: `${quoteName}`,
				}));

				if (!create) {
					switch (myLang) {
					case 'en':
						sendMessage('Failed to add quote');
						break;
					case 'uk':
						sendMessage('Не вдалося додати цитату');
						break;
					}
				}
				else if (create) {
					switch (myLang) {
					case 'en':
						sendMessage(`Quote ${create.id} added`);
						break;
					case 'uk':
						sendMessage(`Цитата ${create.id} додана`);
						break;
					}
				}
			}
			else {
				switch (myLang) {
				case 'en':
					sendMessage('You do not have permission');
					break;
				case 'uk':
					sendMessage('Ви не маєте дозволу');
					break;
				}
			}
		}

		async function handleDeleteQuote(quoteId) {
			const broadcaster = userstate.badges.broadcaster === '1';
			const moderator = userstate.badges.moderator === '1';
			// const vip = userstate.badges.vip === '1';

			if (broadcaster || moderator) {
				if (!quoteId) {
					switch (myLang) {
					case 'en':
						sendMessage('Add the quote number');
						break;
					case 'uk':
						sendMessage('Додайте номер цитати');
						break;
					}
					return;
				}

				// quoteId не є числом
				if (quoteId && isNaN(quoteId)) {
					switch (myLang) {
					case 'en':
						sendMessage('Enter the quote number');
						break;
					case 'uk':
						sendMessage('Вкажіть номер цитати');
						break;
					}
					return;
				}

				const quote = await safeDBQuery(() => tables.quote.findOne({
					where: { CodeName: 'Quote', ChannelName: `${channel}` } }));

				if (!quote) {
					switch (myLang) {
					case 'en':
						sendMessage('No quotes found');
						break;
					case 'uk':
						sendMessage('Цитати не знайдені');
						break;
					}
					return;
				}

				const quoteNumber = await safeDBQuery(() => tables.quote.findOne({
					where: { CodeName: 'Quote', ChannelName: `${channel}`, id: `${quoteId}` } }));

				if (!quoteNumber) {
					switch (myLang) {
					case 'en':
						sendMessage(`Quote ${quoteId} not found`);
						break;
					case 'uk':
						sendMessage(`Цитата ${quoteId} не знайдена`);
						break;
					}
					return;
				}

				const destroy = await safeDBQuery(() => tables.quote.destroy({ where: {
					CodeName: 'Quote',
					ChannelName: `${channel}`,
					id: `${quoteId}`,
				} }));

				if (!destroy) {
					switch (myLang) {
					case 'en':
						sendMessage('Failed to delete quote');
						break;
					case 'uk':
						sendMessage('Не вдалося видалити цитату');
						break;
					}
				}
				else if (destroy) {
					switch (myLang) {
					case 'en':
						sendMessage(`Quote ${quoteId} deleted`);
						break;
					case 'uk':
						sendMessage(`Цитата ${quoteId} видалена`);
						break;
					}
				}
			}
			else {
				switch (myLang) {
				case 'en':
					sendMessage('You do not have permission');
					break;
				case 'uk':
					sendMessage('Ви не маєте дозволу');
					break;
				}
			}
		}

		function sendMessage(msg) {
			Twitch.client.say(channel, `/me ${msg}`);
		}
	},
};
