const app = require('../../app.json');
const env = process.env;

const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const fs = require('node:fs');

const tables = require(`../../../${app.app[0].tablesjs}`);

const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports.add = {
  Greet: async (member, ClientDiscord) => {
    if (!fs.existsSync(`./${app.Discord[2].serverssq}`)) return;
    if (!fs.existsSync(`./${app.Discord[0].greetsq}`)) return;

    const lServer = await tables.server.findOne({
      where: { GuildId: `${member.guild.id}` } });

    if (!lServer) return;

    const myLang = `${lServer.GuildLanguage}`;

    const lGreet = await tables.greet.findOne({
      where: { CodeName: 'Greet', GuildId: `${member.guild.id}` } });

    if (!lGreet) return;

    const channel = ClientDiscord.channels.cache.get(`${lGreet.ChannelId}`);

    if (!channel) return;

    const canvas = Canvas.createCanvas(500, 500);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(env.GreetPng);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(235, 235, 195, 0, Math.PI * 2, true);
    // 1 коло ліворуч/праворуч менше/більше
    // 2 коло вгору/вниз менше/більше
    // 3 радіус кола
    context.closePath();
    context.clip();

    const { body } = await request(member.user.displayAvatarURL({ extension: 'png', size: 1024, dynamic: true }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());
    context.drawImage(avatar, 40, 40, 390, 390);
    // 1 фото ліворуч/праворуч менше/більше
    // 2 фото вгору/вниз менше/більше
    // 3,4 розмір фото

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'carlita.png' });

    if (myLang === 'en') {
      channel.send({ content: `Welcome ${member}`, files: [attachment] });
    }
    else if (myLang === 'uk') {
      channel.send({ content: `Вітаю ${member}`, files: [attachment] });
    }
  },
};

module.exports.remove = {
  Bye: async (member, ClientDiscord) => {
    if (!fs.existsSync(`./${app.Discord[2].serverssq}`)) return;
    if (!fs.existsSync(`./${app.Discord[0].greetsq}`)) return;

    const lServer = await tables.server.findOne({
      where: { GuildId: `${member.guild.id}` } });

    if (!lServer) return;

    const myLang = `${lServer.guildlanguage}`;

    const lGreet = await tables.greet.findOne({
      where: { CodeName: 'Bye', GuildId: `${member.guild.id}` } });

    if (!lGreet) return;

    const channel = ClientDiscord.channels.cache.get(`${lGreet.ChannelId}`);

    if (!channel) return;

    const canvas = Canvas.createCanvas(500, 500);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage(env.GreetPng);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(235, 235, 195, 0, Math.PI * 2, true);
    // 1 коло ліворуч/праворуч менше/більше
    // 2 коло вгору/вниз менше/більше
    // 3 радіус кола
    context.closePath();
    context.clip();

    const { body } = await request(member.user.displayAvatarURL({ extension: 'png', size: 1024, dynamic: true }));
    const avatar = await Canvas.loadImage(await body.arrayBuffer());
    context.drawImage(avatar, 40, 40, 390, 390);
    // 1 фото ліворуч/праворуч менше/більше
    // 2 фото вгору/вниз менше/більше
    // 3,4 розмір фото

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'carlita.png' });

    if (myLang === 'en') {
      channel.send({ content: `Bye ${member}`, files: [attachment] });
    }
    else if (myLang === 'uk') {
      channel.send({ content: `Бувайте ${member}`, files: [attachment] });
    }
  },
};

module.exports.msg = {
  Greet: async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    const lServer = await tables.server.findOne({
      where: { GuildId: `${msg.guild.id}` } });

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;
    const myLang = `${lServer.GuildLanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const channel = msg.mentions.channels.first();

    const StripMenu = env.StripMenu;
    const DiscordGif = env.DiscordGif;

    if (command === 'greet' || command === 'g') {
      const lGreet = await tables.greet.findOne({
        where: { CodeName: 'Greet', GuildId: `${msg.guild.id}` } });

      if (!args.length) {
        const EmbedEn = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Greet')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Advice', value: `${myPref}${command} greet / bye / list / del / me`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        const EmbedUk = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Greet')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Порада', value: `${myPref}${command} greet / bye / list / del / me`, inline: true },
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

      if (args[0] === 'me' || args[0] === 'm') {
        const canvas = Canvas.createCanvas(500, 500);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(env.GreetPng);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.arc(235, 235, 195, 0, Math.PI * 2, true);
        // 1 коло ліворуч/праворуч менше/більше
        // 2 коло вгору/вниз менше/більше
        // 3 радіус кола
        context.closePath();
        context.clip();

        const { body } = await request(msg.author.displayAvatarURL({ extension: 'png', size: 1024, dynamic: true }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());
        context.drawImage(avatar, 40, 40, 390, 390);
        // 1 фото ліворуч/праворуч менше/більше
        // 2 фото вгору/вниз менше/більше
        // 3,4 розмір фото

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'carlita.png' });

        msg.channel.send({ content: `Вітаю <@${msg.author.id}>`, files: [attachment] });
      }

      if (args[0] === 'greet' || args[0] === 'g') {
        if (!channel) {
          const EmbedAddEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Greet')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Advice', value: `${myPref}${command} greet #channel`, inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedAddUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Greet')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Порада', value: `${myPref}${command} greet #channel`, inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedAddEn] });
          }
          else if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedAddUk] });
          }
        }

        if (!lGreet) {
          const create = await tables.greet.create({
            CodeName: 'Greet',
            ChannelName: `${channel}`,
            ChannelId: `${channel.id}`,
            GuildId: `${msg.guild.id}`,
          });

          if (create) {
            const EmbedAddEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: `**Greet** message successfully added.\n\nChannel for **greet** messages: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedAddUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: `**Привітальне** повідомлення успішно додане.\n\nКанал для **привітальних** повідомлень: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedAddEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedAddUk] });
            }
          }
        }

        if (lGreet) {

          const update = await tables.greet.update({
            ChannelName: `${channel}`,
            ChannelId: `${channel.id}`,
          }, { where: {
            CodeName: 'Greet',
            GuildId: `${msg.guild.id}` } });

          if (update) {
            const EmbedAddEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good', value: `**Greet** message successfully updated.\n\nChannel for **greet** messages: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedAddUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре', value: `**Привітальне** повідомлення успішно оновлене.\n\nКанал для **привітальних** повідомлень: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedAddEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedAddUk] });
            }
          }
        }
      }

      if (args[0] === 'list' || args[0] === 'l') {
        const lGreets = await tables.greet.findAll({
          attributes: ['CodeName', 'ChannelName', 'ChannelId', 'GuildName', 'GuildId' ],
          where: { GuildId: `${msg.guild.id}` } });

        const CodeName = lGreets.map(l => l.CodeName).join('\n') || '0';
        const ChannelName = lGreets.map(l => l.ChannelName).join('\n') || '0';

        const EmbedListEn = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Greet')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Message', value: `${CodeName}`, inline: true },
            { name: 'Channel', value: `${ChannelName}`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        const EmbedListUk = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Greet')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Повідомлення', value: `${CodeName}`, inline: true },
            { name: 'Канал', value: `${ChannelName}`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        if (myLang === 'en') {
          msg.channel.send({ embeds: [EmbedListEn] });
        }
        else if (myLang === 'uk') {
          msg.channel.send({ embeds: [EmbedListUk] });
        }
      }

      if (args[0] === 'del' || args[0] === 'd') {
        if (!lGreet) {
          const EmbedDelEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Greet')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Failed to delete **greet** message.\n\n__List is empty.__', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedDelUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Greet')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Не вдалося видалити **привітальне** повідомлення.\n\n__Список порожній.__', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedDelEn] });
          }
          else if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedDelUk] });
          }
        }

        if (lGreet) {
          const destroy = await tables.greet.destroy({
            where: {
              CodeName: 'Greet',
              GuildId: `${msg.guild.id}`,
            } });

          if (destroy) {
            const EmbedDelEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: '**Greet** message successfully deleted.', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedDelUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Greet')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Вітаю!', value: '**Привітальне** повідомлення успішно видалене.', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedDelEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedDelUk] });
            }
          }
        }
      }
    }

    if (command === 'bye' || command === 'b') {
      const lBye = await tables.greet.findOne({
        where: { CodeName: 'Bye', GuildId: `${msg.guild.id}` } });

      if (!args.length) {
        const EmbedByeEn = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Bye')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Advice!', value: 'Bye: add / list / del', inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        const EmbedByeUk = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Bye')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Порада!', value: 'Bye: add / list / del', inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        if (myLang === 'en') {
          return msg.channel.send({ embeds: [EmbedByeEn] });
        }
        else if (myLang === 'uk') {
          return msg.channel.send({ embeds: [EmbedByeUk] });
        }
      }

      if (args[0] === 'add' || args[0] === 'a') {
        if (!channel) {
          const EmbedAddEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Bye')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Advice!', value: 'Bye: add #channel', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedAddUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Bye')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Порада!', value: 'Bye: add #канал', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedAddEn] });
          }
          else if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedAddUk] });
          }
        }

        if (!lBye) {
          const create = await tables.greet.create({
            CodeName: 'Bye',
            ChannelName: `${channel}`,
            ChannelId: `${channel.id}`,
            GuildId: `${msg.guild.id}` });

          if (create) {
            const EmbedAddEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good! ', value: `**Bye** message successfully added.\nChannel for **bye** messages: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedAddUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре!', value: `**Прощальне** повідомлення успішно додане.\nКанал для **прощальних** повідомлень: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedAddEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedAddUk] });
            }
          }
        }
        else if (lBye) {
          const update = await tables.greet.update({
            ChannelName: `${channel}`,
            ChannelId: `${channel.id}`,
          }, { where: {
            CodeName: 'Bye',
            GuildId: `${msg.guild.id}` } });

          if (update) {
            const EmbedAddEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good! ', value: `**Bye** message successfully updated.\nChannel for **bye** messages: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedAddUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре!', value: `**Прощальне** повідомлення успішно оновлене.\nКанал для **прощальних** повідомлень: ${channel}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedAddEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedAddUk] });
            }
          }
        }
      }

      if (args[0] === 'list' || args[0] === 'l') {
        const lByes = await tables.greet.findAll({
          attributes: [ 'CodeName', 'ChannelName', 'ChannelId', 'GuildName', 'GuildId' ],
          where: { GuildId: `${msg.guild.id}` } });

        const CodeName = lByes.map(l => l.CodeName).join('\n') || '0';
        const ChannelName = lByes.map(l => l.ChannelName).join('\n') || '0';

        const EmbedListEn = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Bye')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Message', value: `${CodeName}`, inline: true },
            { name: 'Channel', value: `${ChannelName}`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        const EmbedListUk = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Bye')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Повідомлення', value: `${CodeName}`, inline: true },
            { name: 'Канал', value: `${ChannelName}`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });

        if (myLang === 'en') {
          msg.channel.send({ embeds: [EmbedListEn] });
        }
        else if (myLang === 'uk') {
          msg.channel.send({ embeds: [EmbedListUk] });
        }
      }

      if (args[0] === 'del' || args[0] === 'd') {
        if (!lBye) {
          const EmbedDelEn = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Bye')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Failed to delete **bye** message.\n\nList is empty.', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          const EmbedDelUk = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Bye')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Не вдалося видалити **прощальне** повідомлення.\n\nСписок порожній.', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedDelEn] });
          }
          else if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedDelUk] });
          }
        }
        else if (lBye) {
          const destroy = await tables.greet.destroy({
            where: { CodeName: 'Bye', GuildId: `${msg.guild.id}` } });

          if (destroy) {
            const EmbedDelEn = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Good!', value: '**Bye** message successfully deleted.', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            const EmbedDelUk = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Bye')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Добре!', value: '**Прощальне** повідомлення успішно видалене.', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });

            if (myLang === 'en') {
              msg.channel.send({ embeds: [EmbedDelEn] });
            }
            else if (myLang === 'uk') {
              msg.channel.send({ embeds: [EmbedDelUk] });
            }
          }
        }
      }
    }
  },
};
