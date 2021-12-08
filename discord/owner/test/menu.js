const tServ = require('../../../discord/main/server/server.js');

const env = process.env;

const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports.interaction = {
  Country: async interaction => {
    // if (!interaction.isCommand()) return;

    const Menu1 = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('select:1')
          .setPlaceholder('Nothing selected')
          .addOptions([
            {
              label: 'Timeout',
              description: 'Timeout',
              value: 'option:1',
            },
            {
              label: 'Embed',
              description: 'Embed',
              value: 'option:2',
            },
            {
              label: 'Color',
              description: 'Color',
              value: 'option:3',
            },
            {
              label: 'Prefix',
              description: 'Prefix',
              value: 'option:4',
            },
            {
              label: 'Повернутися',
              description: 'Повернутися',
              value: 'option:5',
            },
          ]),
      );

    const Image = env.stripmenu;

    const Embed1 = new MessageEmbed()
      .setAuthor('Discord', '', 'https://discord.com/')
      .setDescription('Discord Timeout')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '\u200B', value: `Timeout: ${}` inline: true },
      )
      .setImage(Image)
      .setFooter('Discord', env.discordgif);

    switch (`${interaction.customId}`) {
    case 'select:1':
      switch (`${interaction.values}`) {
      case 'option:1':
        await interaction.update({ ephemeral: true, embeds: [Embed1], components: [Menu1] });
        break;
      case 'option:2':
        await interaction.update({ ephemeral: true, embeds: [Embed2], components: [Menu1] });
        break;
      case 'option:3':
        await interaction.update({ ephemeral: true, embeds: [Embed3], components: [Menu1] });
        break;
      case 'option:4':
        await interaction.update({ ephemeral: true, embeds: [Embed4], components: [Menu1] });
        break;
      case 'option:5':
        await interaction.update({ ephemeral: true, embeds: [Embed5], components: [Menu1] });
        break;
      }
      break;
    }
  },
};
