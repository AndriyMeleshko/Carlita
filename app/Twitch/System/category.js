const fetch = require('node-fetch');
const fs = require('fs');

const app = require('../../app.json');
const env = process.env;

const Twitch = require(`../../../${app.Twitch[3].twitchjs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

let timer_category;

module.exports.logon = {
	Category: async () => {
		async function safeDBQuery(query) {
			try {
				return await query();
			}
			catch (error) {
				console.error('File: category.js / Помилка бази даних:', error);
				return null;
			}
		}

		// Використання функції safeDBQuery для отримання Bearer
		const Bearer = await safeDBQuery(() => tables.bearer.findOne({
			where: { CodeName: 'Bearer' } }));

		// Перевірка чи доступний Bearer.AccessToken
		if (!Bearer || !Bearer.AccessToken) {
			console.error('Попередження: AccessToken Bearer не був знайдений. Будь ласка, зв\'яжіться з адміністратором.');
			return;
		}

		// Встановлення параметрів для запиту
		const options = {
			method: 'get',
			headers: {
				'Client-ID': `${env.ClientTwitchId}`,
				'Authorization': `${Bearer.AccessToken}`,
			},
		};

		async function TimerCategory() {
			if (!fs.existsSync(`${app.Twitch[2].bearersq}`) || !fs.existsSync(`./${app.Twitch[2].categorysq}`)) {
				stopTimerCategory();
				startTimerCategory();
				return;
			}

			const Categoryesdb = await safeDBQuery(() => tables.category.findAll({
				attributes: ['ChannelName'],
				where: { CodeName: 'Category' } }));

			try {
				// Кількість каналів у пачці
				const chunkSize = 100;

				// Розділення списку каналів на пачки
				const chunks = [];
				for (let i = 0; i < Categoryesdb.length; i += chunkSize) {
					chunks.push(Categoryesdb.slice(i, i + chunkSize));
				}

				// Перевірка статусу кожного каналу
				const offlineChannelsToUpdate = [];
				const onlineChannelsToUpdate = [];
				for (const chunk of chunks) {
					const channelsToCheck = chunk.map(person => person.ChannelName);

					const responses = await Promise.all(channelsToCheck.map(channelName =>
						fetch(`${env.StreamUserLogin}${channelName}`, options)
							.then(response => response.json()),
					));

					responses.forEach((response, index) => {
						const channelName = channelsToCheck[index];

						if (!response || !response.data || response.data.length === 0) {
							offlineChannelsToUpdate.push(channelName);
						}
						else {
							onlineChannelsToUpdate.push(channelName);
						}
					});
				}

				let Delay = 0;

				offlineChannelsToUpdate.forEach((person) => {
					setTimeout(async () => {
						const categoryOn = await safeDBQuery(() => tables.category.findOne({
							where: { CodeName: 'Category', ChannelName: `${person}`, Status: 'on' } }));

						if (categoryOn) {
							// setTimeout(async () => {}, 3 * 60 * 1000);
							const update = await safeDBQuery(() => tables.category.update({
								Status: 'off' }, {
								where: { CodeName: 'Category', ChannelName: `${person}`, Status: 'on' } }));

							if (update) {
								const oneCategory = await safeDBQuery(() => tables.category.findOne(
									{ where: { CodeName: 'Category', Channelname: `${person}` } }));

								// Перевірка чи category не є null перед використанням
								if (oneCategory && oneCategory.Category) {
									// Відправка повідомлення до каналу
									Twitch.client.say(`${person}`, `!sg ${oneCategory.Category}`);
									console.log('Category Status off:', person);
								}
								else {
									console.error('Помилка: немає категорії для каналу', person);
								}
							}
						}
					}, 6 * 1000 + Delay);
					Delay += 6 * 1000;
				});

				// TimerCategory9();

				/* function TimerCategory9() {
          Twitch.client.say(`${person}`, `!sg ${oneCategory.Category}`);
                  console.log('Category Status off:', person);
        } */

				onlineChannelsToUpdate.forEach((person) => {
					setTimeout(async () => {
						const categoryOff = await safeDBQuery(() => tables.category.findOne({ where: { CodeName: 'Category', ChannelName: `${person}`, Status: 'off' } }));

						if (categoryOff) {
							const update = await safeDBQuery(() => tables.category.update(
								{ Status: 'on' },
								{ where: { CodeName: 'Category', ChannelName: `${person}`, Status: 'off' } }));

							if (update) {
								const oneCategory = await safeDBQuery(() => tables.category.findOne(
									{ where: { Channelname: `${person}` } }));

								// Перевірка чи category не є null перед використанням
								if (oneCategory && oneCategory.Category) {
									// Відправка повідомлення до каналу
									// Twitch.client.say(`${person}`, `!sg ${oneCategory.Category}`);
									console.log('Category Status on:', person);
								}
								else {
									console.error('Помилка: немає категорії для каналу', person);
								}
							}
						}
					}, 6 * 1000 + Delay);
					Delay += 6 * 1000;
				});

				// Визначення часу перезапуску
				let intervalInSeconds = 60;
				if (offlineChannelsToUpdate.length > 0 || onlineChannelsToUpdate.length > 0) {
					const totalChannels = Categoryesdb.length;
					const channelsChecked = totalChannels - offlineChannelsToUpdate.length - onlineChannelsToUpdate.length;
					// 6 секунд на перевірку одного каналу
					const timePerChannel = 6;
					// Час у хвилинах
					const estimatedTimeInSeconds = (channelsChecked * timePerChannel) / 60;
					// Мінімум 60 секунд
					intervalInSeconds = Math.max(60, Math.ceil(estimatedTimeInSeconds));
				}

				// Перевірка, чи не менше 60 секунд
				intervalInSeconds = Math.max(60, intervalInSeconds);

				// Перезапуск інтервалу
				startTimerCategory(intervalInSeconds);
			}
			catch (error) {
				console.error('Помилка під час отримання даних про користувачів:', error);
			}
		}

		function startTimerCategory(intervalInSeconds) {
			timer_category = setTimeout(TimerCategory, intervalInSeconds * 1000);
		}

		function stopTimerCategory() {
			clearTimeout(timer_category);
		}

		// Початкове запуск інтервалу
		startTimerCategory();
	},
};

module.exports.msg = {
	Category: async (channel, userstate, message, self) => {
		if (self) return;

		async function safeDBQuery(query) {
			try {
				return await query();
			}
			catch (error) {
				console.error('File: category.js / Помилка бази даних:', error);
				return null;
			}
		}

		const Bearer = await safeDBQuery(() => tables.bearer.findOne(
			{ where: { CodeName: 'Bearer' } }));

		const Channel = await safeDBQuery(() => tables.channel.findOne(
			{ where: { ChannelName: `${channel}` } }));

		if (!Bearer || !Bearer.AccessToken) {
			console.error('Попередження: AccessToken Bearer не був знайдений. Будь ласка, зв\'яжіться з адміністратором.');
			return;
		}

		// Встановлення параметрів для запиту
		const options = {
			method: 'get',
			headers: {
				'Client-ID': `${env.ClientTwitchId}`,
				'Authorization': `${Bearer.AccessToken}`,
			},
		};

		const myPref = `${Channel.ChannelPrefix}`;
		const myLang = `${Channel.ChannelLanguage}`;

		if (!message.startsWith(myPref)) return;
		const args = message.slice(myPref.length).toLowerCase().split(/ +/);
		const command = args.shift().toLowerCase();

		switch (command) {
		case 'category':
		case 'cat':
			handleCategoryCommand();
			break;
		}

		async function handleCategoryCommand() {
			if (!args.length) {
				sendMessage(`${myPref}cat add / list / del`);
				return;
			}

			switch (args[0]) {
			case 'add':
				await handleAddCategory(args.slice(1).join(' '));
				break;
			case 'list':
				await handleListCategories();
				break;
			case 'delete':
			case 'del':
				await handleDeleteCategory();
				break;
			}
		}

		async function handleAddCategory(categoryName) {
			// Логіка для додавання категорії
			if (!categoryName) {
				switch (myLang) {
				case 'en':
					sendMessage('Enter the name of the category');
					break;
				case 'uk':
					sendMessage('Вкажіть ім\'я категорії');
					break;
				}
				return;
			}

			const Category = await safeDBQuery(() => tables.category.findOne(
				{ where: { CodeName: 'Category', ChannelName: `${channel}` } }));

			if (Category) {
				switch (myLang) {
				case 'en':
					sendMessage(`Category "${categoryName}" already exists`);
					break;
				case 'uk':
					sendMessage(`Категорія "${categoryName}" вже існує`);
					break;
				}
				return;
			}

			try {
				const gameName = await fetch(`${env.GameName}${categoryName.replace(/ /g, '%20')}`, options).then(response => response.json());

				if (!gameName || !gameName.data || !gameName.data[0] || gameName.data[0] === undefined) {
					switch (myLang) {
					case 'en':
						sendMessage(`Category "${categoryName}" does not exist`);
						break;
					case 'uk':
						sendMessage(`Категорії "${categoryName}" не існує`);
						break;
					}
					return;
				}

				const create = await safeDBQuery(() => tables.category.create({
					CodeName: 'Category',
					ChannelName: `${channel}`,
					Category: `${gameName.data[0].name}`,
					Status: 'on' }));

				if (create) {
					switch (myLang) {
					case 'en':
						sendMessage(`Category "${categoryName}" added`);
						break;
					case 'uk':
						sendMessage(`Категорія "${categoryName}" додана`);
						break;
					}
				}
			}
			catch (error) {
				console.error('Error:', error);
				switch (myLang) {
				case 'en':
					sendMessage('An error occurred while adding the category');
					break;
				case 'uk':
					sendMessage('Під час додавання категорії сталася помилка');
					break;
				}
			}
		}

		async function handleListCategories() {
			// Логіка для виведення списку категорій
			try {
				const Categories = await safeDBQuery(() => tables.category.findAll(
					{ attributes: ['Category', 'Status'], where: { ChannelName: `${channel}` } }));

				if (Categories.length === 0) {
					switch (myLang) {
					case 'en':
						sendMessage('No categories found');
						break;
					case 'uk':
						sendMessage('Категорії не знайдено');
						break;
					}
					return;
				}

				const Category = Categories.map(item => item.Category);
				const Status = Categories.map(item => item.Status);

				switch (myLang) {
				case 'en':
					sendMessage(`Category: ${Category} / ${Status}`);
					break;
				case 'uk':
					sendMessage(`Категорія: ${Category} / ${Status}`);
					break;
				}
			}
			catch (error) {
				console.error('Error:', error);
				switch (myLang) {
				case 'en':
					sendMessage('An error occurred while listing categories');
					break;
				case 'uk':
					sendMessage('Під час переліку категорій сталася помилка');
					break;
				}
			}
		}

		async function handleDeleteCategory() {
			// Логіка для видалення категорії
			const lCategory = await safeDBQuery(() => tables.category.findOne(
				{ where: { CodeName: 'Category', ChannelName: `${channel}` } }));

			if (!lCategory) {
				switch (myLang) {
				case 'en':
					sendMessage('No category found to delete');
					break;
				case 'uk':
					sendMessage('Не знайдено категорій для видалення');
					break;
				}
				return;
			}

			try {
				const destroy = await safeDBQuery(() => tables.category.destroy(
					{ where: { CodeName: 'Category', ChannelName: `${channel}` } }));

				if (destroy) {
					switch (myLang) {
					case 'en':
						sendMessage('Category deleted');
						break;
					case 'uk':
						sendMessage('Категорія видалена');
						break;
					}
				}
			}
			catch (error) {
				console.error('Error:', error);
				switch (myLang) {
				case 'en':
					sendMessage('An error occurred while deleting the category');
					break;
				case 'uk':
					sendMessage('Під час видалення категорії сталася помилка');
					break;
				}
			}
		}

		function sendMessage(msg) {
			Twitch.client.say(channel, `/me ${msg}`);
		}
	},
};
