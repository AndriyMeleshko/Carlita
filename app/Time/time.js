console.log('Running file: time.js');

const app = require('../app.json');

const moment = require('moment-timezone');
const fs = require('fs');

const tables = require('../../app/tables.js');

/* async function safeDBQuery(query) {
  try {
    return await query();
  }
  catch (error) {
    console.error('time.js: Помилка бази даних:', error);
    return null;
  }
} */

async function safeDBQuery(query) {
	try {
		return await query();
	}
	catch (error) {
		// Перевірка, чи спричинила помилку відсутність таблиці
		if (!error.message.includes('no such table: times')) {
			console.error('time.js: Помилка бази даних:', error);
		}
		else {
			console.error('Помилка бази даних: time.sqlite');
		}
		return null;
	}
}

// Встановлюємо часовий пояс (можна змінити на потрібний)
moment.tz.setDefault('Europe/Kyiv');

let lastIsSummerTime = moment().isDST();

setInterval(async () => {
	const isSummerTime = moment().isDST();

	if (isSummerTime !== lastIsSummerTime) {
		lastIsSummerTime = isSummerTime;
		checkAndRecordTime();
	}

	const existingRecord = await safeDBQuery(() => tables.time.findOne({ where: { CodeName: 'Time' } }));

	if (!existingRecord || !existingRecord.CodeName) {
		checkAndRecordTime();
	}
}, 1 * 1000);

// Функція для перевірки та запису даних в базу
async function checkAndRecordTime() {
	if (!fs.existsSync(`./${app.Time[0].timesq}`)) return;

	// Отримуємо поточний час
	const currentDate = moment();

	// Визначаємо останню неділю березня та жовтня
	const lastSundayOfMarch = moment(currentDate).month(2).endOf('month').day('Sunday');
	const lastSundayOfOctober = moment(currentDate).month(9).endOf('month').day('Sunday');

	// console.log(lastSundayOfMarch);
	// console.log(lastSundayOfOctober);

	let seasonValue = 0;

	// Перевіряємо, чи поточна дата пізніше останньої неділі березня та жовтня
	const isSummerTime = currentDate.isAfter(lastSundayOfMarch);
	const isWinterTime = currentDate.isAfter(lastSundayOfOctober);

	// console.log(isSummerTime);
	// console.log(isWinterTime);

	// Встановлюємо правильний зсув у залежності від часу року
	if (isSummerTime) {
		// Літній час: переведення на 1 годину вперед о 03:00 в останню неділю березня
		if (currentDate.isSameOrAfter(lastSundayOfMarch)) {
			currentDate.set({ hour: 3, minute: 0, second: 0, millisecond: 0 });
			seasonValue = 3;
		}
	}
	else if (isWinterTime) {
		// Зимовий час: переведення на 1 годину назад о 04:00 в останню неділю жовтня
		if (currentDate.isSameOrAfter(lastSundayOfOctober)) {
			currentDate.set({ hour: 4, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'hour');
			seasonValue = 2;
		}
	}
	else if (isSummerTime === false && isWinterTime === false) {
		// Зимовий час: переведення на 1 годину назад о 04:00 в останню неділю жовтня
		currentDate.set({ hour: 4, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'hour');
		seasonValue = 2;
	}

	// console.log(seasonValue);

	// Виводимо інформацію у консоль
	// console.log(`Поточна дата: ${currentDate.format()}, сезон: ${seasonValue}`);

	const existingRecord = await safeDBQuery(() => tables.time.findOne(
		{ where: { CodeName: 'Time' } }));

	if (existingRecord && `${existingRecord.Hours}` === '2' && seasonValue === '3') {
		try {
			await safeDBQuery(() => existingRecord.update(
				{ Hours: `${seasonValue}` }));
			console.log(`Дані про час успішно оновлені: +${seasonValue}`);
		}
		catch (error) {
			console.error('Помилка при оновленні даних про час:', error);
		}
	}
	else if (existingRecord && `${existingRecord.Hours}` === '3' && seasonValue === '2') {
		try {
			await safeDBQuery(() => existingRecord.update(
				{ Hours: `${seasonValue}` }));
			console.log(`Дані про час успішно оновлені: +${seasonValue}`);
		}
		catch (error) {
			console.error('Помилка при оновленні даних про час:', error);
		}
	}
	else if (!existingRecord) {
		try {
			await tables.time.create({
				CodeName: 'Time',
				Date: `${currentDate.toDate()}`,
				Hours: `${seasonValue}`,
			});
			console.log(`Дані про час успішно додані: +${seasonValue}`);
		}
		catch (error) {
			console.error('Помилка при додаванні даних про час:', error);
		}
	}
}

// Викликаємо функцію на початку роботи програми
// checkAndRecordTime();
