const app = require('../../app.json');
const env = process.env;

// const fetch = require('node-fetch');
// const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('node:fs');

const tables = require(`../../../${app.app[0].tablesjs}`);

const { ActivityType, EmbedBuilder } = require('discord.js');

async function safeDBQuery(query) {
  try {
    return await query();
  }
  catch (error) {
    console.error('status.js: Помилка бази даних:', error);
    return null;
  }
}

module.exports.ready = {
  Status: async (ClientDiscord) => {

    setInterval(async () => {
      if (!fs.existsSync(`${app.Time[0].timesq}`)) return;
      if (!fs.existsSync(`${app.Discord[2].statussq}`)) return;

      const lTime = await safeDBQuery(() => tables.time.findOne(
        { where: { CodeName: 'Time' } }));

      if (!lTime) return;

      const Date = moment().utc().locale('en').add(lTime.Hours, 'h').format('h:mm');

      const lStatus = await safeDBQuery(() => tables.status.findOne(
        { where: { CodeName: 'Status' } }));

      if (!lStatus) {
        const create = await safeDBQuery(() => tables.status.create(
          { CodeName: 'Status', Time: `${Date}` }));

        if (create) {
          console.log(`Discord Status Create: ${Date}`);
        }
      }

      if (!lStatus) return;

      if (Date !== lStatus.Time) {
        const update = await safeDBQuery(() => tables.status.update(
          { Time: `${Date}` },
          { where: { CodeName: 'Status' } }));

        if (update) {
          const monthsReplacement = [
            ['січень', 'січня'],
            ['лютий', 'лютого'],
            ['березень', 'березня'],
            ['квітень', 'квітня'],
            ['травень', 'травня'],
            ['червень', 'червня'],
            ['липень', 'липня'],
            ['серпень', 'серпня'],
            ['вересень', 'вересня'],
            ['жовтень', 'жовтня'],
            ['листопад', 'листопада'],
            ['грудень', 'грудня'],
          ];

          let formattedDate = moment().utc().locale('uk').add(lTime.Hours, 'h').format('h:mm A, D MMMM, dddd, YYYY');

          monthsReplacement.forEach(([original, replacement]) => {
            formattedDate = formattedDate.replace(original, replacement);
          });

          if (ClientDiscord && ClientDiscord.user && ClientDiscord.user.setActivity) {
            const date = moment().utc().locale('uk').add(lTime.Hours, 'h').format('h:mm A');

            if (date === '9:00 ранку') {
              // console.log('1', date);
              ClientDiscord.user.setActivity('Хвилина мовчання', { type: ActivityType.Custom });
            }
            else {
              // console.log('2', date);
              ClientDiscord.user.setActivity(formattedDate, { type: ActivityType.Custom });
            }
          }
          else {
            console.error('Неможливо встановити активність користувача Discord: метод setActivity не існує або недоступний');
          }
        }
      }
      else {
        return;
      }

    }, 1 * 1000);
  },
};

module.exports.msg = {
  Status: async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    const lServer = await safeDBQuery(() => tables.server.findOne(
      { where: { GuildId: `${msg.guild.id}` } }));

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const StripMenu = env.StripMenu;
    const DiscordGif = env.DiscordGif;

    if (command === 'status') {
      if (!args.length) {
        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Status')
          .addFields(
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Warning', value: 'Add:', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });
        return msg.channel.send({ embeds: [embed] });
      }
    }
  },
};
