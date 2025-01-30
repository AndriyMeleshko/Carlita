const app = require('../../app.json');

const tables = require(`../../../${app.app[0].tablesjs}`);

const tButton = require('../../../app/Discord/Commands/button.js');
const tEmbed = require('../../../app/Discord/Commands/embed.js');
const tMenu = require('../../../app/Discord/Commands/menu.js');

let timeout1;
let timeout2;
let timeout3;
let timeout4;
let timeout5;

module.exports.interaction = {
  TermsMenu: async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const timeout = 60 * 1000;

    const message = interaction.channel.messages.cache.get(`${interaction.message.id}`);

    switch (`${interaction.customId}`) {
    case 'Terms':

      switch (`${interaction.values}`) {
      case 'Set:En':

        await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn], components: [tMenu.MenuTermEn, tButton.ButtonTermEn] });

        if (timeout1) clearTimeout(timeout1);
        if (timeout2) clearTimeout(timeout2);
        if (timeout3) clearTimeout(timeout3);
        if (timeout4) clearTimeout(timeout4);
        if (timeout5) clearTimeout(timeout5);

        timeout1 = setTimeout(() => {
          message.edit({ ephemeral: true, embeds: [tEmbed.EmbedTerm], components: [tMenu.MenuTerm] });
        }, timeout);
        break;

      case 'Set:Uk':
        await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk], components: [tMenu.MenuTermUk, tButton.ButtonTermUk] });

        if (timeout1) clearTimeout(timeout1);
        if (timeout2) clearTimeout(timeout2);
        if (timeout3) clearTimeout(timeout3);
        if (timeout4) clearTimeout(timeout4);
        if (timeout5) clearTimeout(timeout5);

        timeout2 = setTimeout(() => {
          message.edit({ ephemeral: true, embeds: [tEmbed.EmbedTerm], components: [tMenu.MenuTerm] });
        }, timeout);
        break;
      }
      break;
    }
  },

  TermsButton: async (interaction) => {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
    case 'TermEn:1':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn1], components: [tMenu.MenuTermEn, tButton.ButtonTermEn1] });
      break;

    case 'TermEn:2':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn2], components: [tMenu.MenuTermEn, tButton.ButtonTermEn2] });
      break;

    case 'TermEn:3':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn3], components: [tMenu.MenuTermEn, tButton.ButtonTermEn3] });
      break;

    case 'TermEn:4':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn4], components: [tMenu.MenuTermEn, tButton.ButtonTermEn4] });
      break;

    case 'TermEn:5':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermEn5], components: [tMenu.MenuTermEn, tButton.ButtonTermEn5] });
      break;

    case 'TermUk:1':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk1], components: [tMenu.MenuTermUk, tButton.ButtonTermUk1] });
      break;

    case 'TermUk:2':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk2], components: [tMenu.MenuTermUk, tButton.ButtonTermUk2] });
      break;

    case 'TermUk:3':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk3], components: [tMenu.MenuTermUk, tButton.ButtonTermUk3] });
      break;

    case 'TermUk:4':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk4], components: [tMenu.MenuTermUk, tButton.ButtonTermUk4] });
      break;

    case 'TermUk:5':
      await interaction.update({ ephemeral: true, embeds: [tEmbed.EmbedTermUk5], components: [tMenu.MenuTermUk, tButton.ButtonTermUk5] });
      break;
    }
  },
};


module.exports.msg = {
  Terms: async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    const lServer = await tables.server.findOne({ where: { GuildId: `${msg.guild.id}` } });
    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'terms' || command === 'умови') {

      msg.delete();

      if (!args.length) {
        await msg.channel.send({ ephemeral: true, embeds: [tEmbed.EmbedTerm], components: [tMenu.MenuTerm] });
      }
    }
  },
};
