let timeuot1;
let timeuot2;
let timeuot3;
let timeuot4;
let timeuot5;

const tServer = require('../../../../discord/main/server/server.js');
const tButton = require('../../../../discord/admin/commands/rules/button.js');
const tMenu = require('../../../../discord/admin/commands/rules/menu.js');

const Sequelize = require('sequelize');

const env = process.env;

const { Permissions, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/admin/commands/rules/rules.sqlite',
});

const rule = sequelize.define('rule', {
  codename: Sequelize.TEXT,
  langrule: Sequelize.STRING,
  langserver: Sequelize.STRING,
  twitch: Sequelize.STRING,
  langrulename: Sequelize.STRING,
  langservername: Sequelize.STRING,
  twitchname: Sequelize.STRING,
  channelname: Sequelize.STRING,
  channelid: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
});

rule.sync();

module.exports = { rule };

module.exports.interaction = {
  RuleButton: async (interaction) => {

    if (!interaction.isButton()) return;

    const RuleEN = `
**Welcome!**
Read ours carefully rules.




\u2063\u2002\u2063
`;

    const RuleUK = `
**Вітаємо!**
Уважно читайте наші правила.
`;

    const RuleEN1 = `
**Treat everyone with respect.** **Absolutely no** harassment,witch hunting, sexism, racism, or hate speech will be tolerated.

\u2063\u2002\u2063
`;

    const RuleUK1 = `
**Спілкуйтеся ввічливо.** **Категорично заборонені** агресія, полювання на відьом, расистські, сексистські та ксенофобські висловлювання.
`;

    const RuleEN1l = `
**Only Ukrainian language.**
**Treat everyone with respect.** **Absolutely no** harassment, witch hunting, sexism, racism, or hate speech will be tolerated.
`;

    const RuleUK1l = `
**Спілкуйтеся виключно українською мовою.**
**Спілкуйтеся ввічливо.** **Категорично заборонені** агресія, полювання на відьом, расистські, сексистські та ксенофобські висловлювання.
`;

    const RuleEN2 = `
**No spam** or self promotion (server invites, advertisements, etc) without permission from a staff member. **This** includes DMing fellow members.
`;

    const RuleUK2 = `
**Заборонений спам** та самореклама (запрошення на сервер, рекламні оголошення тощо) без дозволу з боку керівництва, зокрема в приватних повідомленнях.
`;

    const RuleEN3 = `
**No NSFW** or obscene content. **This** includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.
`;

    const RuleUK3 = `
**Контент NSFW** (не для перегляду на роботі) та непристойний контент заборонені, зокрема тексти, зображення та посилання, що містять оголеність, секс, тяжке насилля чи інший провокативний контент.
`;

    const RuleEN4 = `
**If you** see something against the rules or something that makes you feel unsafe, let staff know. We want this server to be a welcoming space!
\u2063\u2002\u2063
`;

    const RuleUK4 = `
**Якщо** побачите порушення правил або щось, що вас бентежить, — повідомте адміністрацію. Ми хочемо, щоби сервер був комфортним місцем для спілкування!
`;

    const RuleEN5 = `
**Thank you for your attention!**
Have a good day.



\u2063\u2002\u2063
`;

    const RuleUK5 = `
**Дякуємо за увагу!**
Гарного вам дня.
`;

    const RuleEN5l = `
**Умови!**`;

    const RuleUK5l = `
**1**. Відкрийте налаштуванння вашого облікового запису Discord.
**2**. Перейдіть до вкладки меню __З'єднання__.
**3**. Приєднайте свій обліковий запис Twitch до свого облікового запису Discord.
**4**. Увімкніть __Відображати у профілі__.
**5**. Розкажіть нашим __адміністраторам__ про виконані дії.
`;

    const EpilepsyEN = `
**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.epilepsy}).
_**Viewer discretion is advised.**_`;

    const EpilepsyUK = `
**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.epilepsy}).
_**Рекомендується на розсуд глядача.**_
`;

    const StripRule = env.stripRule;

    const StripConnect = env.stripConnect;

    const Embed0ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN}\n${RuleUK}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed1ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN1}\n${RuleUK1}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed1ENUKl = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN1l}\n${RuleUK1l}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed2ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN2}\n${RuleUK2}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed3ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN3}\n${RuleUK3}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed4ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN4}\n${RuleUK4}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed5ENUK = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN5}\n${RuleUK5}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripRule)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const Embed5ENUKl = new MessageEmbed()
      .setColor('#5c68ee')
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: `${RuleEN5l}\n${RuleUK5l}`, inline: true },
        { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
      )
      .setImage(StripConnect)
      .setFooter(`Ⓒ ${interaction.guild.name}`, env.discordgif);

    const timeout = 60000;

    const message = interaction.channel.messages.cache.get(`${interaction.message.id}`);

    switch (interaction.customId) {
    case 'rule:1ENUK':
      await interaction.update({ ephemeral: true, embeds: [Embed1ENUK], components: [tButton.button1enuk] });
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot1 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
      }, timeout);
      break;
    case 'rule:1ENUKl':
      await interaction.update({ ephemeral: true, embeds: [Embed1ENUKl], components: [tButton.button1enukl] });
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot1 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
      }, timeout);
      break;
    case 'rule:2ENUK':
      await interaction.update({ ephemeral: true, embeds: [Embed2ENUK], components: [tButton.button2enuk] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot2 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
      }, timeout);
      break;
    case 'rule:2ENUKl':
      await interaction.update({ ephemeral: true, embeds: [Embed2ENUK], components: [tButton.button2enukl] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot2 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
      }, timeout);
      break;
    case 'rule:3ENUK':
      await interaction.update({ ephemeral: true, embeds: [Embed3ENUK], components: [tButton.button3enuk] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot3 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
      }, timeout);
      break;
    case 'rule:3ENUKl':
      await interaction.update({ ephemeral: true, embeds: [Embed3ENUK], components: [tButton.button3enukl] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot4) clearTimeout(timeuot4);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot3 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
      }, timeout);
      break;
    case 'rule:4ENUK':
      await interaction.update({ ephemeral: true, embeds: [Embed4ENUK], components: [tButton.button4enuk] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot4 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
      }, timeout);
      break;
    case 'rule:4ENUKl':
      await interaction.update({ ephemeral: true, embeds: [Embed4ENUK], components: [tButton.button4enukl] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot5) clearTimeout(timeuot5);
      timeuot4 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
      }, timeout);
      break;
    case 'rule:5ENUK':
      await interaction.update({ ephemeral: true, embeds: [Embed5ENUK], components: [tButton.button5enuk] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      timeuot5 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
      }, timeout);
      break;
    case 'rule:5ENUKl':
      await interaction.update({ ephemeral: true, embeds: [Embed5ENUKl], components: [tButton.button5enukl] });
      if (timeuot1) clearTimeout(timeuot1);
      if (timeuot2) clearTimeout(timeuot2);
      if (timeuot3) clearTimeout(timeuot3);
      if (timeuot4) clearTimeout(timeuot4);
      timeuot5 = setTimeout(() => {
        message.edit({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
      }, timeout);
      break;
    }
  },

  RuleMenu: async (interaction) => {

    if (!interaction.isSelectMenu()) return;

    const listServ = await tServer.server.findOne({ where: { guildid: `${interaction.guild.id}` } });

    if (!listServ) return;

    const myPref = `${listServ.guildprefix}`;

    const lRules = await rule.findAll({ attributes: [
      'codename',
      'langrule',
      'langserver',
      'twitch',
      'langrulename',
      'langservername',
      'twitchname',
      'channelname',
      'channelid',
      'guildname',
      'guildid',
    ], where: { guildid: `${interaction.guild.id}` } });

    const langrulename = lRules.map(l => l.langrulename) || '\u200B';
    const langservername = lRules.map(l => l.langservername) || '\u200B';
    const twitchname = lRules.map(l => l.twitchname) || '\u200B';

    const Menu1 = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:rule:1')
          .setPlaceholder(`${langrulename}`)
          .addOptions([
            {
              label: 'Мова правил: Англійська',
              description: 'Правила: Англійська мова.',
              value: 'option:1',
            },
            {
              label: 'Мова правил: Українська',
              description: 'Правила: Українська мова.',
              value: 'option:2',
            },
            {
              label: 'Мова правил: Англійська та Українська',
              description: 'Правила: Англійська та Українська мови.',
              value: 'option:3',
            },
          ]),
      );

    const Menu2 = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:rule:2')
          .setPlaceholder(`${langservername}`)
          .addOptions([
            {
              label: 'Мова спільноти: Англійська',
              description: 'Спілкування: Англійська мова.',
              value: 'option:4',
            },
            {
              label: 'Мова спільноти: Українська',
              description: 'Спілкування: Українська мова.',
              value: 'option:5',
            },
            {
              label: 'Мова спільноти: Англійська та Українська',
              description: 'Спілкування: Англійська та Українська мови.',
              value: 'option:6',
            },
            {
              label: 'Мова спільноти: Вимкнена',
              description: 'Спілкування: Вільно.',
              value: 'option:7',
            },
          ]),
      );

    const Menu3 = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:rule:3')
          .setPlaceholder(`${twitchname}`)
          .addOptions([
            {
              label: 'Twitch: Так',
              description: 'Умова: Приєднати обліковий запис Twitch.',
              value: 'option:8',
            },
            {
              label: 'Twitch: Ні',
              description: 'Умова: Приєднати обліковий запис Twitch.',
              value: 'option:9',
            },
          ]),
      );

    const StripMenu = env.stripMenu;

    const EmbedMenu = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Rules')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Налаштування!', value: `Налаштуйте правила для вашої спільноти, а потім опублікуйте правила **${myPref}rules** на потрібному вам каналі.\n\n**Наразі доступні два варіанти!**\n**Загальний:**\nМова правил: Англійська та Українська\nМова спільноти: Вимкнена\nTwitch: Ні\n**Користувацький:**\nМова правил: Англійська та Українська\nМова спільноти: Українська\nTwitch: Так`, inline: true },
      )
      .setImage(StripMenu)
      .setFooter('Discord', env.discordgif);

    switch (`${interaction.customId}`) {
    case 'select:rule:1':
      switch (`${interaction.values}`) {
      case 'option:1':
        await rule.update({
          langrule: 'en',
          langrulename: 'Мова правил: Англійська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [tMenu.menu1en, Menu2, Menu3] });
          });
        break;
      case 'option:2':
        await rule.update({
          langrule: 'uk',
          langrulename: 'Мова правил: Українська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [tMenu.menu1uk, Menu2, Menu3] });
          });
        break;
      case 'option:3':
        await rule.update({
          langrule: 'en uk',
          langrulename: 'Мова правил: Англійська та Українська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [tMenu.menu1enuk, Menu2, Menu3] });
          });
        break;
      }
      break;
    }

    switch (`${interaction.customId}`) {
    case 'select:rule:2':
      switch (`${interaction.values}`) {
      case 'option:4':
        await rule.update({
          langserver: 'en',
          langservername: 'Мова спільноти: Англійська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, tMenu.menu2en, Menu3] });
          });
        break;
      case 'option:5':
        await rule.update({
          langserver: 'uk',
          langservername: 'Мова спільноти: Українська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, tMenu.menu2uk, Menu3] });
          });
        break;
      case 'option:6':
        await rule.update({
          langserver: 'en uk',
          langservername: 'Мова спільноти: Англійська та Українська',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, tMenu.menu2enuk, Menu3] });
          });
        break;
      case 'option:7':
        await rule.update({
          langserver: 'no',
          langservername: 'Мова спільноти: Вимкнена',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, tMenu.menu2no, Menu3] });
          });
        break;
      }
      break;
    }

    switch (`${interaction.customId}`) {
    case 'select:rule:3':
      switch (`${interaction.values}`) {
      case 'option:8':
        await rule.update({
          twitch: 'yes',
          twitchname: 'Twitch: Так',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, Menu2, tMenu.menu3yes] });
          });
        break;
      case 'option:9':
        await rule.update({
          twitch: 'no',
          twitchname: 'Twitch: Ні',
        }, {
          where: {
            codename: 'rules',
          },
        })
          .then(async () => {
            await interaction.update({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, Menu2, tMenu.menu3no] });
          });
        break;
      }
      break;
    }
  },
};

module.exports.msg = {
  Rule: async (msg) => {
    if (msg.author.bot) return;

    const admin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const owner = msg.member.id === env.ownerdiscordid;

    const listServ = await tServer.server.findOne({ where: { guildid: `${msg.guild.id}` } });

    if (!listServ) return;

    const myPref = `${listServ.guildprefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'rule' || command === 'rules') {
      if (admin || owner) {

        msg.delete();

        const lRule = await rule.findOne({ where: {
          codename: 'rules',
          guildid: `${msg.guild.id}`,
        } });

        if (!lRule) {
          await rule.create({
            codename: 'rules',
            langrulename: 'Мова правил:',
            langservername: 'Мова спільноти:',
            twitchname: 'Twitch:',
            channelname: `${msg.channel.name}`,
            channelid: `${msg.channel.id}`,
            guildname: `${msg.guild.name}`,
            guildid: `${msg.guild.id}`,
          });
        }

        const RuleEN = `
**Welcome!**
Read ours carefully rules.




\u2063\u2002\u2063
`;

        const RuleUK = `
**Вітаємо!**
Уважно читайте наші правила.
`;

        const EpilepsyEN = `
**This server** contains flashing images that may cause discomfort or trigger seizures for peop with photosensitive [epilepsy](${env.epilepsy}).
_**Viewer discretion is advised.**_`;

        const EpilepsyUK = `
**Цей сервер** містить миготливі зображення, які можуть викликати дискомфорт або викликати судоми у людей з світлочутливою [епілепсією](${env.epilepsy}).
_**Рекомендується на розсуд глядача.**_
`;

        const lRules = await rule.findAll({ attributes: [
          'codename',
          'langrule',
          'langserver',
          'twitch',
          'langrulename',
          'langservername',
          'twitchname',
          'channelname',
          'channelid',
          'guildname',
          'guildid',
        ], where: { guildid: `${msg.guild.id}` } });

        const langrulename = lRules.map(l => l.langrulename) || '0';
        const langservername = lRules.map(l => l.langservername) || '0';
        const twitchname = lRules.map(l => l.twitchname) || '0';

        const Menu1 = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('select:rule:1')
              .setPlaceholder(`${langrulename}`)
              .addOptions([
                {
                  label: 'Мова правил: Англійська',
                  description: 'Правила: Англійська мова.',
                  value: 'option:1',
                },
                {
                  label: 'Мова правил: Українська',
                  description: 'Правила: Українська мова.',
                  value: 'option:2',
                },
                {
                  label: 'Мова правил: Англійська та Українська',
                  description: 'Правила: Англійська та Українська мови.',
                  value: 'option:3',
                },
              ]),
          );

        const Menu2 = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('select:rule:2')
              .setPlaceholder(`${langservername}`)
              .addOptions([
                {
                  label: 'Мова спільноти: Англійська',
                  description: 'Спілкування: Англійська мова.',
                  value: 'option:4',
                },
                {
                  label: 'Мова спільноти: Українська',
                  description: 'Спілкування: Українська мова.',
                  value: 'option:5',
                },
                {
                  label: 'Мова спільноти: Англійська та Українська',
                  description: 'Спілкування: Англійська та Українська мови.',
                  value: 'option:6',
                },
                {
                  label: 'Мова спільноти: Вимкнена',
                  description: 'Спілкування: Вільно.',
                  value: 'option:7',
                },
              ]),
          );

        const Menu3 = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('select:rule:3')
              .setPlaceholder(`${twitchname}`)
              .addOptions([
                {
                  label: 'Twitch: Так',
                  description: 'Умова: Приєднати обліковий запис Twitch.',
                  value: 'option:8',
                },
                {
                  label: 'Twitch: Ні',
                  description: 'Умова: Приєднати обліковий запис Twitch.',
                  value: 'option:9',
                },
              ]),
          );

        const StripRule = env.stripRule;

        const StripMenu = env.stripMenu;

        // const StripMsg = env.stripMsg;

        const EmbedMenu = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Rules')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Налаштування!', value: `Налаштуйте правила для вашої спільноти, а потім опублікуйте правила **${myPref}rules** на потрібному вам каналі.\n\n**Наразі доступні два варіанти!**\n**Загальний:**\nМова правил: Англійська та Українська\nМова спільноти: Вимкнена\nTwitch: Ні\n**Користувацький:**\nМова правил: Англійська та Українська\nМова спільноти: Українська\nTwitch: Так`, inline: true },
          )
          .setImage(StripMenu)
          .setFooter('Discord', env.discordgif);

        const Embed0ENUK = new MessageEmbed()
          .setColor('#5c68ee')
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Rules')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: '\u200B', value: `${RuleEN}\n${RuleUK}`, inline: true },
            { name: '\u200B', value: `${EpilepsyEN}\n${EpilepsyUK}`, inline: true },
          )
          .setImage(StripRule)
          .setFooter(`Ⓒ ${msg.guild.name}`, env.discordgif);

        const lRule2 = await rule.findOne({ where: {
          codename: 'rules',
          langrule: 'en uk',
          langserver: 'no',
          twitch: 'no',
          guildid: `${msg.guild.id}`,
        } });

        const lRule3 = await rule.findOne({ where: {
          codename: 'rules',
          langrule: 'en uk',
          langserver: 'uk',
          twitch: 'yes',
          guildid: `${msg.guild.id}`,
        } });

        if (!args.length) {
          if (!lRule) {
            const Embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Rules')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: `Спочатку налаштуйте правила для вашої спільноти **${myPref}rules set**, а потім опублікуйте правила **${myPref}rules** на потрібному вам каналі.\n\n**Наразі доступні два варіанти!**\n**Загальний:**\nМова правил: Англійська та Українська\nМова спільноти: Вимкнена\nTwitch: Ні\n**Користувацький:**\nМова правил: Англійська та Українська\nМова спільноти: Українська\nTwitch: Так`, inline: true },
              )
              .setImage(StripMenu)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [Embed] });
          }

          if (lRule2) {
            await msg.channel.send({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enuk] });
          }
          else

          if (lRule3) {
            await msg.channel.send({ ephemeral: true, embeds: [Embed0ENUK], components: [tButton.button0enukl] });
          }
        }

        if (args[0] === 'setting' || args[0] === 'set' || args[0] === 's') {

          await msg.channel.send({ ephemeral: true, embeds: [EmbedMenu], components: [Menu1, Menu2, Menu3] });
        }

        if (args[0] === 'list' || args[0] === 'l') {

          const Embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Rules')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Language Rule', value: `${langrulename}`, inline: false },
              { name: 'Language Server', value: `${langservername}`, inline: false },
              { name: 'Twitch', value: `${twitchname}`, inline: false },
            )
            .setImage(StripMenu)
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [Embed] });
        }

        if (args[0] === 'delete' || args[0] === 'del' || args[0] === 'd') {

          await rule.destroy({ where: {
            guildid: `${msg.guild.id}`,
          } });
        }
      }
    }
  },
};
