const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const MenuTerm = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('Terms')
      .setPlaceholder('Select a language • Виберіть мову')
      .addOptions([
        {
          label: 'English',
          description: 'English',
          value: 'Set:En',
        },
        {
          label: 'Українська',
          description: 'Українська',
          value: 'Set:Uk',
        },
      ]),
  );

const MenuTermEn = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('Terms')
      .setPlaceholder('English')
      .addOptions([
        {
          label: 'English',
          description: 'Terms in English',
          value: 'Set:En',
        },
        {
          label: 'Українська',
          description: 'Умови українською',
          value: 'Set:Uk',
        },
      ]),
  );

const MenuTermUk = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('Terms')
      .setPlaceholder('Українська')
      .addOptions([
        {
          label: 'English',
          description: 'Terms in English',
          value: 'Set:En',
        },
        {
          label: 'Українська',
          description: 'Умови українською',
          value: 'Set:Uk',
        },
      ]),
  );

module.exports = {
  MenuTerm,

  MenuTermEn,
  MenuTermUk,
};
