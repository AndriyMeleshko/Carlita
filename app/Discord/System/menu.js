const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const MenuEn = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('server:1')
      .setPlaceholder('Nothing selected')
      .addOptions([
        {
          label: 'Prefix',
          description: 'Server Prefix',
          value: 'prefix:1',
        },
        {
          label: 'Language',
          description: 'Server Language',
          value: 'language:1',
        },
        {
          label: 'ID',
          description: 'Server ID',
          value: 'id:1',
        },
      ]),
  );

const MenuUk = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('server:1')
      .setPlaceholder('Нічого не вибрано')
      .addOptions([
        {
          label: 'Префікс',
          description: 'Префікс сервера',
          value: 'prefix:1',
        },
        {
          label: 'Мова',
          description: 'Мова сервера',
          value: 'language:1',
        },
        {
          label: 'Ідентифікатор',
          description: 'Ідентифікатор сервера',
          value: 'id:1',
        },
      ]),
  );

module.exports = {
  MenuEn,
  MenuUk,
};
