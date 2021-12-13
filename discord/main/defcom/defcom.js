const tServ = require('../../../discord/main/server/server.js');

const { MessageEmbed } = require('discord.js');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env;

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord//main/defcom/defcom.sqlite',
});

const defcom = sequelize.define('commands', {
  name: Sequelize.TEXT,
  command: Sequelize.STRING,
  description: Sequelize.STRING,
  guildname: Sequelize.STRING,
  guildid: Sequelize.STRING,
});

module.exports = { defcom };

defcom.sync();

module.exports.msg = {
  Commands: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;
    if (!fs.existsSync('./discord/main/defcom/defcom.sqlite')) return;

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    // const args0 = args.slice(0, 1);
    // const args1 = args.slice(1, 2);
    // const args2 = args.slice(2, 3);
    const args2l = args.slice(2).join(' ');
    // const args3l = args.slice(3).join(' ');

    const StripMsg = env.stripMsg;

    const owner = msg.member.id !== env.ownerDiscordId;
    if (owner) return;

    if (command === 'def') {
      if (!args[0]) {
        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Default Commands')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: add / list / del', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Default Commands')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Додайте: add / list / del', inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      if (args[0] === 'add') {
        if (!args[1]) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add: New command.', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте: Нову команду.', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            return msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        const lCom = await defcom.findOne({ where: { command: `${args[1]}` } });

        if (!lCom) {
          if (!`${args2l}`) {
            const create = await defcom.create({
              name: 'custom',
              command: `${args[1]}`,
              description: '0',
              guildname: `${msg.guild.name}`,
              guildid: `${msg.guild.id}`,
            });
            if (create) {
              if (myLang === 'en') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Default Commands')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Warning!', value: `Command: **${args[1]}** added successfully.`, inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                msg.channel.send({ embeds: [exampleEmbed] });
              }
              if (myLang === 'uk') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Default Commands')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Увага!', value: `Команда: **${args[1]}** успішно додана.`, inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                msg.channel.send({ embeds: [exampleEmbed] });
              }
            }
          }
          else if (`${args2l}`) {
            const create = await defcom.create({
              name: 'custom',
              command: `${args[1]}`,
              description: `${args2l}`,
              guildname: `${msg.guild.name}`,
              guildid: `${msg.guild.id}`,
            });
            if (create) {
              if (myLang === 'en') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Default Commands')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Warning!', value: `Command: **${args[1]}** added successfully.`, inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                msg.channel.send({ embeds: [exampleEmbed] });
              }
              if (myLang === 'uk') {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor('Discord', '', 'https://discord.com/')
                  .setDescription('Discord Default Commands')
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Увага!', value: `Команда: **${args[1]}** успішно додана.`, inline: true },
                  )
                  .setImage(StripMsg)
                  .setFooter('Discord', env.discordgif);
                msg.channel.send({ embeds: [exampleEmbed] });
              }
            }
          }
        }
        else
        if (lCom) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: `Command: **${args[1]}** already exists.`, inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: `Команда: **${args[1]}** вже існує.`, inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }
        }
      }

      if (args[0] === 'list') {
        const lCustoms = await defcom.findAll({ attributes: ['command'] });

        const defCommand = lCustoms.map(l => l.command).join('\n') || '0';

        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Default Commmands')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Command', value: `${defCommand}`, inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Default Commands')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Команда', value: `${defCommand}`, inline: true },
            )
            .setImage(StripMsg)
            .setFooter('Discord', env.discordgif);
          msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      if (args[0] === 'del') {
        if (!args[1]) {
          if (myLang === 'en') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add: Command from the list. ', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }
          if (myLang === 'uk') {
            const exampleEmbed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Default Commands')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Увага!', value: 'Додайте: Команду зі списку.', inline: true },
              )
              .setImage(StripMsg)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [exampleEmbed] });
          }
        }

        const lCom = await defcom.findOne({ where: { command: `${args[1]}` } });

        if (!lCom) {
          const destroy = await defcom.destroy({ where: {
            command: `${args[1]}`,
          } });
          if (destroy) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Default Commands')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: `Command: **${args[1]}** successfully deleted.`, inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Default Commands')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Команда: **${args[1]}** успішно видалена.`, inline: true },
                )
                .setImage(StripMsg)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [exampleEmbed] });
            }
          }
        }
      }
    }
  },
};
