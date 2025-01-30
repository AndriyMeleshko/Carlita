const app = require('../../app.json');
const env = process.env;

const tables = require(`../../../${app.app[0].tablesjs}`);

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports.msg = {
  Number: async (msg) => {
    const Server = await tables.server.findOne({
      where: { GuildId: `${msg.guild.id}` } });

    if (!Server) return;

    // const myLang = `${lServer.GuildLanguage}`;
    const myLang = 'uk';

    // Пошук запису про число для даного сервера та каналу
    const numberGuild = await tables.number.findOne({
      where: { CodeName: 'Number', GuildId: `${msg.guild.id}` } });

    // Перевірка, чи повідомлення є числом
    if (numberGuild && !isNaN(msg.content)) {
      const userNumber = parseFloat(msg.content);

      // Перевірка наявності запису "Number"
      const numberEntry = await tables.number.findOne({ where: { CodeName: 'Number', ChannelId: `${msg.channel.id}` } });

      if (numberEntry === null || typeof numberEntry.Number === 'undefined') return;

      if (parseFloat(numberEntry.Number) === null) return;

      // Перевірка, чи введене число є наступним числом у послідовності
      if (userNumber === parseFloat(numberEntry.Number) + 1) {

        // Якщо число досягло мільйона, оновлюємо його на 0
        if (userNumber === 1000000) {
          await tables.number.update({ Number: '0' }, { where: { CodeName: 'Number', GuildId: `${msg.guild.id}` } });
          // msg.channel.send(`${msg.author.displayName} ввів число **${userNumber}**`);
          if (myLang === 'en') {
            msg.channel.send(`${msg.author.displayName}: **${userNumber}**`);
          }
          else if (myLang === 'uk') {
            msg.channel.send(`${msg.author.displayName}: **${userNumber}**`);
          }
        }
        else {
          // Оновлення числа в базі даних
          await tables.number.update({ Number: `${userNumber}` }, { where: { CodeName: 'Number', GuildId: msg.guild.id } });
          // msg.channel.send(`${msg.author.displayName} ввів число: ${userNumber}`);
          if (myLang === 'en') {
            // msg.channel.send(`${msg.author.displayName}: **${userNumber}**`);
          }
          else if (myLang === 'uk') {
            // msg.channel.send(`${msg.author.displayName}: **${userNumber}**`);
          }
        }
      }
      else if (userNumber <= parseFloat(numberEntry.Number)) {
        const responsesEn = [
          `it was already ${userNumber}`,
          `${userNumber} again?`,
          `there were already ${userNumber}`,
          `${userNumber}? Seriously?`,
          ':worried:',
        ];

        const responsesUk = [
          `вже було ${userNumber}`,
          `знову ${userNumber}?`,
          `${userNumber} вже було`,
          `${userNumber}? Серйозно?`,
          ':worried:',
        ];

        const resultEn = responsesEn[Math.floor(Math.random() * responsesEn.length)];
        const resultUa = responsesUk[Math.floor(Math.random() * responsesUk.length)];

        // Виведення повідомлення про помилку, якщо число не наступне в послідовності
        if (myLang === 'en') {
          msg.channel.send(`${msg.author.displayName}, ${resultEn}`);
        }
        else if (myLang === 'uk') {
          msg.channel.send(`${msg.author.displayName}, ${resultUa}`);
        }
      }
      else {
        const responsesEn = [
          'hey, can you count?',
          'what are you writing?',
          'we only play consecutive numbers',
          'i love the sequence of numbers',
          ':confused:',
        ];

        const responsesUk = [
          'ей, ви рахувати вмієте?',
          'що це ви таке пишете?',
          'ми граємо лише у послідовні числа',
          'я люблю послідовність чисел',
          ':confused:',
        ];

        const resultEn = responsesEn[Math.floor(Math.random() * responsesEn.length)];
        const resultUa = responsesUk[Math.floor(Math.random() * responsesUk.length)];

        // Виведення повідомлення про помилку, якщо число не наступне в послідовності
        if (myLang === 'en') {
          msg.channel.send(`${msg.author.displayName} ${resultEn}`);
        }
        else if (myLang === 'uk') {
          msg.channel.send(`${msg.author.displayName} ${resultUa}`);
        }
      }
    }

    // Commands

    const myPref = `${Server.GuildPrefix}`;

    const StripMenu = env.StripMenu;
    const DiscordGif = env.DiscordGif;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const owner = msg.author.id === env.OwnerDiscordId;

    const members = msg.member;

    if (owner || members.permissions.has(PermissionsBitField.Flags.Administrator)) {

      if (command === 'number' || command === 'num') {
        if (!args.length) {
          const EmbedEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Number')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning', value: 'Add: #channel or list', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Number')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага', value: 'Додайте: #channel або list', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedEn] });
          }
          else if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedUk] });
          }
        }

        const channel = msg.mentions.channels.first();

        if (channel) {
          const numberData = await tables.number.findOne({ where: { CodeName: 'Number', GuildId: `${msg.guild.id}` } });

          if (!numberData) {
            const create = await tables.number.create({
              CodeName: 'Number',
              Number: '0',
              ChannelName: `${channel.name}`,
              ChannelId: `${channel.id}`,
              GuildId: `${msg.guild.id}` });

            if (create) {
              const EmbedEn = new EmbedBuilder()
                .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
                .setDescription('Discord Number')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Good', value: `Channel ${channel.name} successfully added`, inline: true },
                )
                .setImage(StripMenu)
                .setFooter({ text: 'Discord', iconURL: DiscordGif });

              const EmbedUk = new EmbedBuilder()
                .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
                .setDescription('Discord Number')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Добре', value: `Канал ${channel.name} успішно доданий`, inline: true },
                )
                .setImage(StripMenu)
                .setFooter({ text: 'Discord', iconURL: DiscordGif });

              if (myLang === 'en') {
                return msg.channel.send({ embeds: [EmbedEn] });
              }
              else if (myLang === 'uk') {
                return msg.channel.send({ embeds: [EmbedUk] });
              }
            }
          }

          else if (numberData) {
            const update = await tables.number.update({
              ChannelName: `${channel.name}`,
              ChannelId: `${channel.id}`,
            }, { where: {
              CodeName: 'Number',
              GuildId: `${msg.guild.id}` } });

            if (update) {
              const EmbedEn = new EmbedBuilder()
                .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
                .setDescription('Discord Number')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Good', value: `Channel ${channel.name} updated successfully`, inline: true },
                )
                .setImage(StripMenu)
                .setFooter({ text: 'Discord', iconURL: DiscordGif });

              const EmbedUk = new EmbedBuilder()
                .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
                .setDescription('Discord Number')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Добре', value: `Канал ${channel.name} успішно оновлений`, inline: true },
                )
                .setImage(StripMenu)
                .setFooter({ text: 'Discord', iconURL: DiscordGif });

              if (myLang === 'en') {
                return msg.channel.send({ embeds: [EmbedEn] });
              }
              else if (myLang === 'uk') {
                return msg.channel.send({ embeds: [EmbedUk] });
              }
            }
          }
        }

        if (args[0] === 'delete' || args[0] === 'del') {
          const destroy = await tables.number.destroy({
            where: { GuildId: `${msg.guild.id}` } });

          if (destroy) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: 'All data deleted successfully', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: 'Всі дані успішно видалені', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }
        }

        if (args[0] === 'add') {
          if (!args[1]) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: 'Add a number', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: 'Додайте число', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }

          // args[1] не є числом
          if (isNaN(args[1])) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: 'You need to specify a number', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: 'Потрібно вказати число', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }

          const update = await tables.number.update({
            Number: `${args[1]}`,
          }, {
            where: {
              CodeName: 'Number',
              GuildId: `${msg.guild.id}`,
            },
          });

          if (update) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: `Number ${args[1]} updated successfully`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: `Число ${args[1]} успішно оновлене`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }
        }

        if (args[0] === '0') {
          const update = await tables.number.update({
            Number: '0',
          }, { where: {
            CodeName: 'Number',
            GuildId: `${msg.guild.id}` } });

          if (update) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: `Number successfully replaced by: ${args[0]}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: `Число успішно замінено на: ${args[0]}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }
        }

        if (args[0] === 'list' || args[0] === 'l') {
          const numberList = await tables.number.findAll({
            attributes: ['Number', 'ChannelName'],
            where: { CodeName: 'Number', GuildId: `${msg.guild.id}` } });

          if (!`${numberList}`) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Channel', value: '0', inline: true },
                { name: 'Number', value: '0', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Number')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Канал', value: '0', inline: true },
                { name: 'Число', value: '0', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              return msg.channel.send({ embeds: [EmbedEn] });
            }
            else if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
          }

          const lNumber = numberList.map(obj => obj.Number) || 0;
          const lChannel = numberList.map(obj => obj.ChannelName) || 0;

          const EmbedEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Number')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Channel', value: `${lChannel}`, inline: true },
              { name: 'Number', value: `${lNumber}`, inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Number')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Канал', value: `${lChannel}`, inline: true },
              { name: 'Число', value: `${lNumber}`, inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            msg.channel.send({ embeds: [EmbedEn] });
          }
          else if (myLang === 'uk') {
            msg.channel.send({ embeds: [EmbedUk] });
          }
        }
      }
    }
  },
};
