let timeuot1;
let timeuot2;

const tServ = require('../../discord/main/server/server.js');

const randomAnimal = require('random-animal.js');
const fs = require('fs');

const env = process.env;

const { MessageActionRow, MessageButton } = require('discord.js');

module.exports.interaction = {
  Catdog: async interaction => {
    if (!interaction.isButton()) return;

    const Button0 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('all:cat:1')
          .setLabel('Cat')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('all:dog:2')
          .setLabel('Dog')
          .setStyle('PRIMARY'),
      );

    const Button1 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('all:cat:1')
          .setLabel('Cat')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('all:dog:2')
          .setLabel('Dog')
          .setStyle('PRIMARY'),
      );

    const Button2 = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('all:cat:1')
          .setLabel('Cat')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('all:dog:2')
          .setLabel('Dog')
          .setStyle('PRIMARY'),
      );

    const timeout = 60000;

    const message = interaction.channel.messages.cache.get(`${interaction.message.id}`);

    switch (interaction.customId) {
    case 'all:cat:1':
      randomAnimal.randomCat().then(async cat => {
        await interaction.update({ content: cat, components: [Button1] });
      })
        .catch(err => console.error(err));
      if (timeuot2) clearTimeout(timeuot2);
      timeuot1 = setTimeout(() => {
        message.edit({ content: env.catdog, components: [Button0] });
      }, timeout);
      break;
    case 'all:dog:2':
      randomAnimal.randomDog().then(async dog => {
        await interaction.update({ content: dog, components: [Button2] });
      })
        .catch(err => console.error(err));
      if (timeuot1) clearTimeout(timeuot1);
      timeuot2 = setTimeout(() => {
        message.edit({ content: env.catdog, components: [Button0] });
      }, timeout);
      break;
    }
  },
};

module.exports.msg = {
  async execute(msg) {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'catdog' || command === 'кітпес') {
      const Button0 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('all:cat:1')
            .setLabel('Cat')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('all:dog:2')
            .setLabel('Dog')
            .setStyle('PRIMARY'),
        );

      await msg.channel.send({ content: env.catdog, components: [Button0] });
    }
  },
};
