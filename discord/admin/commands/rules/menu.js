const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const menu1en = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:1')
      .setPlaceholder('Мова правил: Англійська')
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

const menu1uk = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:1')
      .setPlaceholder('Мова правил: Українська')
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

const menu1enuk = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:1')
      .setPlaceholder('Мова правил: Англійська та Українська')
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

const menu2en = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:2')
      .setPlaceholder('Мова спільноти: Англійська')
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

const menu2uk = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:2')
      .setPlaceholder('Мова спільноти: Українська')
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

const menu2enuk = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:2')
      .setPlaceholder('Мова спільноти: Англійська та Українська')
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

const menu2no = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:2')
      .setPlaceholder('Мова спільноти: Вимкнена')
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

const menu3yes = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:3')
      .setPlaceholder('Twitch: Так')
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

const menu3no = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
      .setCustomId('select:rule:3')
      .setPlaceholder('Twitch: Ні')
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

module.exports = {
  menu1en,
  menu1uk,
  menu1enuk,
  menu2en,
  menu2uk,
  menu2enuk,
  menu2no,
  menu3yes,
  menu3no,
};
