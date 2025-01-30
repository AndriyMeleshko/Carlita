const app = require('../../app.json');
const env = process.env;

const tMenu = require(`../../../${app.Discord[2].menujs}`);
const tables = require(`../../../${app.app[0].tablesjs}`);

const fs = require('fs');

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports.ready = {
  Servers: async () => {
    setInterval(async () => {
      if (!fs.existsSync(`${app.Time[0].timejs}`)) return;
      if (!fs.existsSync(`${app.Discord[2].serversjs}`)) return;

      const Server = require(`../../../${app.Discord[3].discordjs}`);
      const guilds = Server.ready.servers;

      const lTime = await tables.time.findOne({ where: { CodeName: 'Time' } });

      if (!lTime) return;

      guilds.map(async (guild) => {
        const lServ = await tables.server.findOne({ where: {
          GuildId: `${guild.id}`,
        } });

        if (!lServ) {
          const create = await tables.server.create({
            CodeName: 'server',
            GuildName: `${guild.name}`,
            GuildId: `${guild.id}`,
            GuildPrefix: `${env.ClientDiscordPrefix}`,
            GuildLanguage: 'en',
          });

          if (create) {
            console.log(`Discord Server | Created: ${create.GuildName} | ID: ${create.GuildId} / Prefix: ${create.GuildPrefix} / Language: ${create.GuildLanguage}`);
          }
        }
      });
    }, 10 * 1000);
  },
};

module.exports.interaction = {
  Servers: async (interaction) => {

    if (!fs.existsSync(`${app.Time[0].timejs}`)) return;
    if (!fs.existsSync(`${app.Discord[2].serversjs}`)) return;

    if (!interaction.isStringSelectMenu()) return;

    const Author = { name: 'Discord', url: 'https://discord.com/' };
    const Description = 'Discord Server';
    const Image = env.StripMenu;
    const Footer = { text: 'Discord', iconURL: env.DiscordGif };

    const lServers = await tables.server.findAll({ attributes: [
      'id',
      'GuildName',
      'GuildId',
      'GuildPrefix',
      'GuildLanguage',
    ] });

    const ID = lServers.map(l => l.id).join('\n') || '0';
    const GuildName = lServers.map(l => l.GuildName).join('\n') || '0';
    const GuildId = lServers.map(l => l.GuildId).join('\n') || '0';
    const GuildPrefix = lServers.map(l => l.GuildPrefix).join('\n') || '0';
    const GuildLanguage = lServers.map(l => l.GuildLanguage).join('\n') || '0';

    const lServer = await tables.server.findOne({ where: { GuildId: `${interaction.guild.id}` } });

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;
    const myLang = `${lServer.GuildLanguage}`;

    const owner = interaction.user.id === env.OwnerDiscordId;
    const administrator = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);

    // Owner En
    const EmbedEnPrOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Server', value: `${GuildName}`, inline: true },
        { name: 'Prefix', value: `${GuildPrefix}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Change Prefix', value: `${myPref}prefix &`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedEnLOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Server', value: `${GuildName}`, inline: true },
        { name: 'Language', value: `${GuildLanguage}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Change Language', value: `${myPref}language uk`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedEnIDOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Server', value: `${GuildName}`, inline: true },
        { name: 'ID', value: `${GuildId}`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    // Owner Uk
    const EmbedUkPrOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Сервер', value: `${GuildName}`, inline: true },
        { name: 'Префікс', value: `${GuildPrefix}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Змінити Префікс', value: `${myPref}префікс &`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedUkLOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Сервер', value: `${GuildName}`, inline: true },
        { name: 'Мова', value: `${GuildLanguage}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Змінити Мову', value: `${myPref}мова en`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedUkIDOwner = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${ID}`, inline: true },
        { name: 'Сервер', value: `${GuildName}`, inline: true },
        { name: 'Ідентифікатор', value: `${GuildId}`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    // Admin En
    const EmbedEnPrAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Server', value: `${lServer.GuildName}`, inline: true },
        { name: 'Prefix', value: `${lServer.GuildPrefix}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Change Prefix', value: `${myPref}prefix &`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedEnLAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Server', value: `${lServer.GuildName}`, inline: true },
        { name: 'Language', value: `${lServer.GuildLanguage}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Change Language', value: `${myPref}language uk`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedEnIDAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Server', value: `${lServer.GuildName}`, inline: true },
        { name: 'ID', value: `${lServer.GuildId}`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    // Admin Uk
    const EmbedUkPrAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Сервер', value: `${lServer.GuildName}`, inline: true },
        { name: 'Префікс', value: `${lServer.GuildPrefix}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Змінити Префікс', value: `${myPref}префікс &`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedUkLAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Сервер', value: `${lServer.GuildName}`, inline: true },
        { name: 'Мова', value: `${lServer.GuildLanguage}`, inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: 'Змінити Мову', value: `${myPref}мова en`, inline: false },
      )
      .setImage(Image)
      .setFooter(Footer);

    const EmbedUkIDAdmin = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '#', value: `${lServer.id}`, inline: true },
        { name: 'Сервер', value: `${lServer.GuildName}`, inline: true },
        { name: 'Ідентифікатор', value: `${lServer.GuildId}`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    // User En
    const EmbedEnUser = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Warning', value: `You <@${interaction.user.id}> are not an administrator`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    // User Uk
    const EmbedUkUser = new EmbedBuilder()
      .setAuthor(Author)
      .setDescription(Description)
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Увага', value: `Ви <@${interaction.user.id}> не адміністратор`, inline: true },
      )
      .setImage(Image)
      .setFooter(Footer);

    switch (`${interaction.customId}`) {
    case 'server:1':
      switch (`${interaction.values}`) {
      case 'prefix:1':
        if (myLang === 'en') {
          if (owner) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnPrOwner], components: [tMenu.MenuEn] });
          }
          else if (administrator) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnPrAdmin], components: [tMenu.MenuEn] });
          }
          else {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnUser], components: [tMenu.MenuEn] });
          }
        }
        else
          if (myLang === 'uk') {
            if (owner) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkPrOwner], components: [tMenu.MenuUk] });
            }
            else if (administrator) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkPrAdmin], components: [tMenu.MenuUk] });
            }
            else {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkUser], components: [tMenu.MenuUk] });
            }
          }
        break;
      case 'language:1':
        if (myLang === 'en') {
          if (owner) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnLOwner], components: [tMenu.MenuEn] });
          }
          else if (administrator) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnLAdmin], components: [tMenu.MenuEn] });
          }
          else {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnUser], components: [tMenu.MenuEn] });
          }
        }
        else
          if (myLang === 'uk') {
            if (owner) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkLOwner], components: [tMenu.MenuUk] });
            }
            else if (administrator) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkLAdmin], components: [tMenu.MenuUk] });
            }
            else {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkUser], components: [tMenu.MenuUk] });
            }
          }
        break;
      case 'id:1':
        if (myLang === 'en') {
          if (owner) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnIDOwner], components: [tMenu.MenuEn] });
          }
          else if (administrator) {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnIDAdmin], components: [tMenu.MenuEn] });
          }
          else {
            await interaction.update({ ephemeral: true, embeds: [EmbedEnUser], components: [tMenu.MenuEn] });
          }
        }
        else
          if (myLang === 'uk') {
            if (owner) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkIDOwner], components: [tMenu.MenuUk] });
            }
            else if (administrator) {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkIDAdmin], components: [tMenu.MenuUk] });
            }
            else {
              await interaction.update({ ephemeral: true, embeds: [EmbedUkUser], components: [tMenu.MenuUk] });
            }
          }
        break;
      }
      break;
    }
  },
};

module.exports.msg = {
  Prefix: async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    if (!fs.existsSync(`${app.Time[0].timejs}`)) return;
    if (!fs.existsSync(`${app.Discord[2].serversjs}`)) return;

    const Author = { name: 'Discord', url: 'https://discord.com/' };
    const Description = 'Discord Prefix';
    const Image = env.StripMenu;
    const Footer = { text: 'Discord', iconURL: env.DiscordGif };

    const lServer = await tables.server.findOne({ where: {
      GuildId: `${msg.guild.id}`,
    } });

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;
    const myLang = `${lServer.GuildLanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'prefix' || command === 'pref' ||
        command === 'префікс' || command === 'преф') {

      if (!args.length) {

        const EmbedEn = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Server', value: `${msg.guild.name}`, inline: true },
            { name: 'Prefix', value: `${myPref}`, inline: true },
            { name: 'Change', value: `${myPref}prefix &`, inline: false },
          )
          .setImage(Image)
          .setFooter(Footer);

        const EmbedUk = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Сервер', value: `${msg.guild.name}`, inline: true },
            { name: 'Префікс', value: `${myPref}`, inline: true },
            { name: 'Змінити', value: `${myPref}префікс &`, inline: false },
          )
          .setImage(Image)
          .setFooter(Footer);

        if (myLang === 'en') {
          return msg.channel.send({ embeds: [EmbedEn] });
        }
        else
          if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedUk] });
          }
      }

      if (args[0]) {

        const lPref = await tables.server.findOne({ where: {
          GuildPrefix: `${args[0]}`,
          GuildId: `${msg.guild.id}`,
        } });

        if (lPref) {

          const EmbedEn = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning', value: `The prefix: **${args[0]}** is already set` },
            )
            .setImage(Image)
            .setFooter(Footer);

          const EmbedUk = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага', value: `Префікс: **${args[0]}** вже встановлений` },
            )
            .setImage(Image)
            .setFooter(Footer);

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedEn] });
          }
          else
            if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
        }

        const update = await tables.server.update({
          GuildPrefix: `${args[0]}`,
        }, {
          where: {
            GuildId: `${msg.guild.id}`,
          } });

        if (update) {

          const EmbedEn = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Good', value: `Prefix replaced with: **${args[0]}**` },
            )
            .setImage(Image)
            .setFooter(Footer);

          const EmbedUk = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Добре', value: `Префікс замінений на: **${args[0]}**` },
            )
            .setImage(Image)
            .setFooter(Footer);

          if (myLang === 'en') {
            return msg.channel.send({ embeds: [EmbedEn] });
          }
          else
            if (myLang === 'uk') {
              return msg.channel.send({ embeds: [EmbedUk] });
            }
        }
      }
    }
  },

  Language: async (msg) => {

    if (!fs.existsSync(`${app.TimeSQ}`)) return;
    if (!fs.existsSync(`${app.BasicServerSQ}`)) return;

    if (msg.author.bot) return;

    const Author = { name: 'Discord', url: 'https://discord.com/' };
    const Description = 'Discord  Language';
    const Image = env.StripMenu;
    const Footer = { text: 'Discord', iconURL: env.DiscordGif };

    const lServer = await tables.server.findOne({ where: {
      GuildId: `${msg.guild.id}`,
    } });

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;
    const myLang = `${lServer.GuildLanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'language' || command === 'lang' ||
        command === 'мова') {

      if (!args.length) {

        const EmbedEn = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Server', value: `${msg.guild.name}`, inline: true },
            { name: 'Language:', value: `**${lServer.GuildLanguage}** / sp / uk`, inline: true },
            { name: 'Change', value: `${myPref}language uk`, inline: false },
          )
          .setImage(Image)
          .setFooter(Footer);

        const EmbedUk = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Сервер', value: `${msg.guild.name}`, inline: true },
            { name: 'Мова:', value: `en / sp / **${lServer.GuildLanguage}**`, inline: true },
            { name: 'Змінити', value: `${myPref}мова en`, inline: false },
          )
          .setImage(Image)
          .setFooter(Footer);

        if (myLang === 'en') {
          return msg.channel.send({ embeds: [EmbedEn] });
        }
        else
          if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedUk] });
          }
      }

      if (args[0] === 'en') {

        if (myLang === 'en') {
          const EmbedEn = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning', value: 'English is already installed' },
            )
            .setImage(Image)
            .setFooter(Footer);

          return msg.channel.send({ embeds: [EmbedEn] });
        }

        const update = await tables.server.update({
          GuildLanguage: 'en',
        }, {
          where: {
            GuildId: `${msg.guild.id}`,
          } });

        if (update) {

          const EmbedEn = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Good', value: 'The language has been replaced by English' },
            )
            .setImage(Image)
            .setFooter(Footer);

          return msg.channel.send({ embeds: [EmbedEn] });
        }
      }

      if (args[0] === 'uk') {

        if (myLang === 'uk') {
          const EmbedUk = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага', value: 'Вже встановлена українська мова' },
            )
            .setImage(Image)
            .setFooter(Footer);

          return msg.channel.send({ embeds: [EmbedUk] });
        }

        const update = await tables.server.update({
          GuildLanguage: 'uk',
        }, {
          where: {
            GuildId: `${msg.guild.id}`,
          } });

        if (update) {

          const EmbedUk = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Добре', value: 'Мова замінена на українську' },
            )
            .setImage(Image)
            .setFooter(Footer);

          return msg.channel.send({ embeds: [EmbedUk] });
        }
      }

      if (args[0] === 'sp') {

        const EmbedEn = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Warning', value: 'Sorry, spanish is missing' },
          )
          .setImage(Image)
          .setFooter(Footer);

        const EmbedUk = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Увага', value: 'Вибачте, іспанська мова відсутня' },
          )
          .setImage(Image)
          .setFooter(Footer);

        if (myLang === 'en') {
          return msg.channel.send({ embeds: [EmbedEn] });
        }
        else
          if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedUk] });
          }
      }
    }
  },

  Servers: async (msg) => {

    if (!fs.existsSync(`${app.TimeSQ}`)) return;
    if (!fs.existsSync(`${app.BasicServerSQ}`)) return;

    if (msg.author.bot) return;

    const Author = { name: 'Discord', url: 'https://discord.com/' };
    const Description = 'Discord  Server';
    const Image = env.StripMenu;
    const Footer = { text: 'Discord', iconURL: env.DiscordGif };

    const lServer = await tables.server.findOne({ where: {
      GuildId: `${msg.guild.id}`,
    } });

    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;
    const myLang = `${lServer.GuildLanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'server' || command === 'serv' ||
        command === 'сервер' || command === 'серв') {

      const owner = msg.author.id === env.OwnerDiscordId;
      const administrator = msg.member.permissions.has(PermissionsBitField.Flags.Administrator);

      if (!args.length) {

        const EmbedEn = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Warning', value: 'Add: list', inline: true },
          )
          .setImage(Image)
          .setFooter(Footer);

        const EmbedUk = new EmbedBuilder()
          .setAuthor(Author)
          .setDescription(Description)
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Увага', value: 'Додайте: list', inline: true },
          )
          .setImage(Image)
          .setFooter(Footer);

        if (myLang === 'en') {
          return msg.channel.send({ embeds: [EmbedEn] });
        }
        else
          if (myLang === 'uk') {
            return msg.channel.send({ embeds: [EmbedUk] });
          }
      }

      if (args[0] === 'list' || args[0] === 'l' ||
        args[0] === 'список') {

        const lServers = await tables.server.findAll({ attributes: [
          'GuildName',
          'GuildId',
          'GuildPrefix',
          'GuildLanguage',
        ],
        });

        const GuildName = lServers.map(l => l.GuildName).join('\n') || '0';

        if (owner) {
          const EmbedEn = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Server', value: `${GuildName}`, inline: true },
            )
            .setImage(Image)
            .setFooter(Footer);

          const EmbedUk = new EmbedBuilder()
            .setAuthor(Author)
            .setDescription(Description)
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Сервер', value: `${GuildName}`, inline: true },
            )
            .setImage(Image)
            .setFooter(Footer);

          if (myLang === 'en') {
            await msg.channel.send({ ephemeral: true, embeds: [EmbedEn], components: [tMenu.MenuEn] });
          }
          else
            if (myLang === 'uk') {
              await msg.channel.send({ ephemeral: true, embeds: [EmbedUk], components: [tMenu.MenuUk] });
            }
        }
        else

          if (!owner && administrator) {
            const EmbedEn = new EmbedBuilder()
              .setAuthor(Author)
              .setDescription(Description)
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Server', value: `${msg.guild.name}`, inline: true },
              )
              .setImage(Image)
              .setFooter(Footer);

            const EmbedUk = new EmbedBuilder()
              .setAuthor(Author)
              .setDescription(Description)
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Сервер', value: `${msg.guild.name}`, inline: true },
              )
              .setImage(Image)
              .setFooter(Footer);

            if (myLang === 'en') {
              await msg.channel.send({ ephemeral: true, embeds: [EmbedEn], components: [tMenu.MenuEn] });
            }
            else
              if (myLang === 'uk') {
                await msg.channel.send({ ephemeral: true, embeds: [EmbedUk], components: [tMenu.MenuUk] });
              }
          }
      }
    }
  },
};
