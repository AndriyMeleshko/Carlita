const tTime = require('../../../time/time.js');

const Sequelize = require('sequelize');
const fs = require('fs');
const moment = require('moment');

const env = process.env;

setTimeout(async () => {

  if (fs.existsSync('./time/time.sqlite')) {

    const lTime = await tTime.time.findOne({ where: { name: 'time' } })
      .catch(err => {
        console.error(`${err.original} | File: server.js`);
      });

    if (lTime) {
      console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | File: server.js`);
    }
  }
});

const { Permissions, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/main/server/server.sqlite',
});

const server = sequelize.define('server', {
  name: Sequelize.TEXT,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
  guildprefix: Sequelize.STRING,
  guildlanguage: Sequelize.STRING,
});

module.exports = { server };

server.sync();

module.exports.interaction = {
  Server: async (interaction) => {
    if (!interaction.isSelectMenu()) return;

    const lServers = await server.findAll({ attributes: ['guildname', 'guildid', 'guildprefix', 'guildlanguage'] });

    const guildName = lServers.map(t => t.guildname).join('\n') || '0';
    const guildId = lServers.map(t => t.guildid).join('\n') || '0';
    const guildPrefix = lServers.map(t => t.guildprefix).join('\n') || '0';
    const guildLanguage = lServers.map(t => t.guildlanguage).join('\n') || '0';

    const MenuEn = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:1')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Prefix',
              description: 'Server Prefix',
              value: 'option:1',
            },
            {
              label: 'Language',
              description: 'Server Language',
              value: 'option:2',
            },
            {
              label: 'ID',
              description: 'Server ID',
              value: 'option:3',
            },
          ]),
      );

    const MenuUk = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:1')
          .setPlaceholder('Нічого не вибрано')
          .addOptions([
            {
              label: 'Префікс',
              description: 'Префікс сервера',
              value: 'option:1',
            },
            {
              label: 'Мова',
              description: 'Мова сервера',
              value: 'option:2',
            },
            {
              label: 'Ідентифікатор',
              description: 'Ідентифікатор сервера',
              value: 'option:3',
            },
          ]),
      );

    const lServ = await server.findOne({ where: { guildid: `${interaction.guild.id}` } });
    if (!lServ) return;

    const myLang = `${lServ.guildlanguage}`;

    const StripMenu = env.stripMenu;

    // En
    const EmbedEn1 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Server', value: `${guildName}`, inline: true },
        { name: 'Prefix', value: `${guildPrefix}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    const EmbedEn2 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Server', value: `${guildName}`, inline: true },
        { name: 'Language', value: `${guildLanguage}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    const EmbedEn3 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Server', value: `${guildName}`, inline: true },
        { name: 'ID', value: `${guildId}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    // Uk
    const EmbedUk1 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Сервер', value: `${guildName}`, inline: true },
        { name: 'Префікс', value: `${guildPrefix}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    const EmbedUk2 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Сервер', value: `${guildName}`, inline: true },
        { name: 'Мова', value: `${guildLanguage}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    const EmbedUk3 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Server')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Сервер', value: `${guildName}`, inline: true },
        { name: 'Ідентифікатор', value: `${guildId}`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    switch (`${interaction.customId}`) {
    case 'select:1':
      switch (`${interaction.values}`) {
      case 'option:1':
        if (myLang === 'en') {
          await interaction.update({ ephemeral: true, embeds: [EmbedEn1], components: [MenuEn] });
        }
        else
        if (myLang === 'uk') {
          await interaction.update({ ephemeral: true, embeds: [EmbedUk1], components: [MenuUk] });
        }
        break;
      case 'option:2':
        if (myLang === 'en') {
          await interaction.update({ ephemeral: true, embeds: [EmbedEn2], components: [MenuEn] });
        }
        else
        if (myLang === 'uk') {
          await interaction.update({ ephemeral: true, embeds: [EmbedUk2], components: [MenuUk] });
        }
        break;
      case 'option:3':
        if (myLang === 'en') {
          await interaction.update({ ephemeral: true, embeds: [EmbedEn3], components: [MenuEn] });
        }
        else
        if (myLang === 'uk') {
          await interaction.update({ ephemeral: true, embeds: [EmbedUk3], components: [MenuUk] });
        }
        break;
      }
      break;
    }
  },
};

module.exports.ready = {
  Server: async () => {

    if (fs.existsSync('./time/time.sqlite')) {

      const lTime = await tTime.time.findOne({ where: { name: 'time' } })
        .catch(err => {
          console.error(`${err.original} | File: server.js (readi)`);
        });

      if (lTime) {
        console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | File: server.js (ready)`);
      }
    }

    if (!fs.existsSync('./time/time.sqlite')) tTime.time.sync();
    if (!fs.existsSync('./discord/main/server/server.sqlite')) server.sync();

    const ready = require('../../../discord/discord.js');
    const guilds = ready.server.guild;

    setInterval(async () => {
      const lTime = await tTime.time.findOne({ where: { name: 'time' } });
      if (!lTime) return;

      guilds.map(async (guild) => {
        const lServ = await server.findOne({ where: { guildid: `${guild.id}` } });

        if (!lServ) {
          const create = await server.create({
            name: 'server',
            guildname: `${guild.name}`,
            guildid: `${guild.id}`,
            guildprefix: `${env.prefix}`,
            guildlanguage: 'en',
          });
          if (create) {
            console.log(`${moment().utc().locale('en').add(lTime.hours, 'h').format('hh:mm:ss a')} | Discord | New Server: ${create.guildname} | ID: ${create.guildid} | Prefix: ${create.guildprefix} | Language: ${create.guildlanguage}`);
          }
        }
      });
    }, 10 * 1000);
  },
};

module.exports.msg = {
  Server: async (msg) => {
    if (!fs.existsSync('./time/time.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    if (msg.author.bot) return;

    const lServ = await server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    const Strip300 = env.stripmsg300;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const admin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const owner = msg.member.id === env.ownerDiscordId;

    if (command === 'prefix' || command === 'pref' ||
        command === 'префікс' || command === 'преф') {
      if (admin || owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Prefix')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Prefix:', value: `${lServ.guildprefix}`, inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Prefix')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Префікс:', value: `${lServ.guildprefix}`, inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0]) {
          const lPref = await server.findOne({ where: { guildprefix: `${args[0]}`, guildid: `${msg.guild.id}` } });

          if (lPref) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: `The prefix: **${args[0]}** is already set.` },
                )
                .setImage(Strip300)
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Префікс: **${args[0]}** вже встановлений.` },
                )
                .setImage(Strip300)
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }
          }

          const update = await server.update({
            guildprefix: `${args[0]}`,
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: `Prefix replaced with: **${args[0]}**` },
                )
                .setImage(Strip300)
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Prefix')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Вітаю!', value: `Префікс замінений на: **${args[0]}**` },
                )
                .setImage(Strip300)
                .setTimestamp()
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
          }
        }
      }
    }

    if (command === 'language' || command === 'lang' ||
        command === 'мова') {
      if (admin || owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Language:', value: `**${lServ.guildlanguage}** / sp / uk`, inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Мова:', value: `en / sp / **${lServ.guildlanguage}**`, inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'en') {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'English is already installed.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          const update = await server.update({
            guildlanguage: 'en',
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'The language has been replaced by English.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'uk') {
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Вже встановлена українська мова.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          const update = await server.update({
            guildlanguage: 'uk',
          }, {
            where: {
              guildid: `${msg.guild.id}`,
            },
          });
          if (update) {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Вітаю!', value: 'Мова замінена на українську.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'sp') {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Sorry, spanish is missing.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Language')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Вибачте, іспанська мова відсутня.' },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }
      }
    }

    if (command === 'server' || command === 'serv' ||
        command === 'сервер' || command === 'серв') {
      if (owner) {
        if (!args.length) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add: list', inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }

          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте: list/ список', inline: true },
              )
              .setImage(Strip300)
              .setTimestamp()
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        if (args[0] === 'list' || args[0] === 'список') {
          const lServs = await server.findAll({ attributes: ['guildname', 'guildid', 'guildprefix', 'guildlanguage'] });

          const guildName = lServs.map(t => t.guildname).join('\n') || '0';

          const MenuEn = new MessageActionRow()
            .addComponents(
              new MessageSelectMenu()
                .setCustomId('select:1')
                .setPlaceholder('Nothing selected')
                .addOptions([
                  {
                    label: 'Prefix',
                    description: 'Server Prefix',
                    value: 'option:1',
                  },
                  {
                    label: 'Language',
                    description: 'Server Language',
                    value: 'option:2',
                  },
                  {
                    label: 'ID',
                    description: 'Server ID',
                    value: 'option:3',
                  },
                ]),
            );

          const MenuUk = new MessageActionRow()
            .addComponents(
              new MessageSelectMenu()
                .setCustomId('select:1')
                .setPlaceholder('Нічого не вибрано')
                .addOptions([
                  {
                    label: 'Префікс',
                    description: 'Префікс сервера',
                    value: 'option:1',
                  },
                  {
                    label: 'Мова',
                    description: 'Мова сервера',
                    value: 'option:2',
                  },
                  {
                    label: 'Ідентифікатор',
                    description: 'Ідентифікатор сервера',
                    value: 'option:3',
                  },
                ]),
            );

          const StripMenu = env.stripMenu;

          if (myLang === 'en') {
            const Embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Server', value: `${guildName}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter('Discord', env.discordgif);

            await msg.channel.send({ ephemeral: true, embeds: [Embed], components: [MenuEn] });
          }
          else
          if (myLang === 'uk') {
            const Embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Server')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Сервер', value: `${guildName}`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter('Discord', env.discordgif);

            await msg.channel.send({ ephemeral: true, embeds: [Embed], components: [MenuUk] });
          }
        }
      }
    }
  },
};
