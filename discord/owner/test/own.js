const tServ = require('../../../discord/main/server/server.js');
const tCom = require('../../../discord/main/defcom/defcom.js');

const { MessageEmbed } = require('discord.js');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env;

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/owner/test/own.sqlite',
});

const own = sequelize.define('own', {
  name: Sequelize.TEXT,
  command: Sequelize.STRING,
  description: Sequelize.STRING,
  timeout: Sequelize.STRING,
  embed: Sequelize.STRING,
  color: Sequelize.STRING,
  prefix: Sequelize.STRING,
  Gname: Sequelize.STRING,
  Gid: Sequelize.STRING,
});

module.exports = { own };

own.sync();

module.exports.msg = {
  Own: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;
    if (!fs.existsSync('./discord/owner/test/own.sqlite')) return;

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    // prefix
    if (msg.content.startsWith(myPref)) {
      const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
      const command = args.shift().toLowerCase();

      if (command) {
        const lOwn = await own.findOne({ where: { command: `${command}`, Gid: `${msg.guild.id}` } });

        if (lOwn) {
          if (lOwn.prefix === 'on') {
            if (lOwn.timeout === 'off') {
              if (lOwn.embed === 'off') {
                msg.channel.send(lOwn.get('description'));
              }
              else
              if (lOwn.embed === 'on') {
                if (lOwn.color === 'off') {
                  const embed = new MessageEmbed()
                    // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
                else
                if (lOwn.color !== 'off') {
                  const embed = new MessageEmbed()
                    .setColor(lOwn.get('color'))
                    // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
              }
            }
            else
            if (lOwn.timeout !== 'off') {
              setTimeout(() => {
                if (lOwn.embed === 'off') {
                  msg.channel.send(lOwn.get('description'));
                }
                else
                if (lOwn.embed === 'on') {
                  if (lOwn.color === 'off') {
                    const embed = new MessageEmbed()
                      // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                  else
                  if (lOwn.color !== 'off') {
                    const embed = new MessageEmbed()
                      .setColor(lOwn.get('color'))
                      // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }, lOwn.timeout * 1000);
            }
          }
        }
      }
    }

    // prefix word
    const argsWord = msg.content.toLowerCase().split(/ +/);

    if (argsWord) {
      const lOwn = await own.findOne({ where: { name: 'own', Gid: `${msg.guild.id}` } });

      if (lOwn) {
        if (lOwn.prefix === 'word') {
          if (argsWord.includes(lOwn.command)) {
            if (lOwn.timeout === 'off') {
              if (lOwn.embed === 'off') {
                msg.channel.send(lOwn.get('description'));
              }
              else
              if (lOwn.embed === 'on') {
                if (lOwn.color === 'off') {
                  const embed = new MessageEmbed()
                  // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
                else
                if (lOwn.color !== 'off') {
                  const embed = new MessageEmbed()
                    .setColor(lOwn.get('color'))
                  // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
              }
            }
            else
            if (lOwn.timeout !== 'off') {
              setTimeout(() => {
                if (lOwn.embed === 'off') {
                  msg.channel.send(lOwn.get('description'));
                }
                else
                if (lOwn.embed === 'on') {
                  if (lOwn.color === 'off') {
                    const embed = new MessageEmbed()
                    // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                  else
                  if (lOwn.color !== 'off') {
                    const embed = new MessageEmbed()
                      .setColor(lOwn.get('color'))
                    // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }, lOwn.timeout * 1000);
            }
          }
        }
      }
    }

    // prefix anywhere
    const argsAny = msg.content.toLowerCase();

    if (argsAny) {
      const lOwn = await own.findOne({ where: { name: 'own', Gid: `${msg.guild.id}` } });

      if (lOwn) {
        if (lOwn.prefix === 'any') {
          if (argsAny.includes(lOwn.command)) {
            if (lOwn.timeout === 'off') {
              if (lOwn.embed === 'off') {
                msg.channel.send(lOwn.get('description'));
              }
              else
              if (lOwn.embed === 'on') {
                if (lOwn.color === 'off') {
                  const embed = new MessageEmbed()
                  // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
                else
                if (lOwn.color !== 'off') {
                  const embed = new MessageEmbed()
                    .setColor(lOwn.get('color'))
                  // .setAuthor('Discord', '', 'https://discord.com/')
                    .setDescription(lOwn.get('description'));
                  msg.channel.send({ embeds: [embed] });
                }
              }
            }
            else
            if (lOwn.timeout !== 'off') {
              setTimeout(() => {
                if (lOwn.embed === 'off') {
                  msg.channel.send(lOwn.get('description'));
                }
                else
                if (lOwn.embed === 'on') {
                  if (lOwn.color === 'off') {
                    const embed = new MessageEmbed()
                    // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                  else
                  if (lOwn.color !== 'off') {
                    const embed = new MessageEmbed()
                      .setColor(lOwn.get('color'))
                    // .setAuthor('Discord', '', 'https://discord.com/')
                      .setDescription(lOwn.get('description'));
                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }, lOwn.timeout * 1000);
            }
          }
        }
      }
    }

    const lCom = await tCom.defcom.findAll({ attributes: ['command'] });
    const defaultCommand = lCom.map(l => l.command);

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'command2' || command === 'com2') {
      if (owner) {
        const args2l = args.slice(2).join(' ');

        if (!args.length) {
          // return msg.channel.send('Додайте: info / add / timeout / embed / color/ prefix / edit / list / del');
          const embed = new MessageEmbed()
            .setDescription('Додайте: info / add / timeout / embed / color/ prefix / edit / list / del');
          return msg.channel.send({ embeds: [embed] });
        }

        // add
        if (args[0] === 'add') {

          // add command answer

          if (!args[1]) {
            return msg.channel.send('Додайте: Нову команду.');
          }
          else
          if (args[1]) {
            const lOwn = await own.findOne({ where: { command: `${command}`, Gid: `${msg.guild.id}` } });

            if (lOwn) {
              return msg.channel.send(`Команда **${args[1]}** вже існує.`);
            }

            if (defaultCommand.includes(`${args[1]}`)) {
              return msg.channel.send(`Команда **${args[1]}** вже існує.`);
            }

            if (!args[2]) {
              return msg.channel.send('Додайте: Відповідь.');
            }

            own.create({
              command: `${args[1]}`,
            }, {
              name: `${msg.guild.name}`,
              id: `${msg.guild.id}`,
            });

            const create = await own.create({
              name: 'own',
              command: `${args[1]}`,
              description: `${args2l}`,
              prefix: 'on',
              timeout: 'off',
              embed: 'off',
              color: 'off',
              Gname: `${msg.guild.name}`,
              Gid: `${msg.guild.id}`,
            });
            if (create) {
              msg.channel.send(`Команда **${create.command}** успішно додана.\nВідповідь: ${create.description}`);
            }
          }
        }

        // timeout
        if (args[0] === 'timeout' || args[0] === 'to') {

          // timeout value command

          if (!args[1]) {
            return msg.channel.send('Додайте: Кількість секунд від **1-60** / off');
          }

          if (isNaN(args[1])) {
            return msg.channel.send('Вкажіть значення від **1-60**.');
          }

          if (args[1] < 1) {
            return msg.channel.send('Вкажіть значення від **1-60**.');
          }

          if (args[1] > 60) {
            return msg.channel.send('Максимальна кількість секунд: **60**');
          }

          if (args[1] !== 'off') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              timeout: `${args[1]}`,
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Команда **${args[2]}** тепер працює з затримкою відповіді у **${args[1]}** сек.`);
            }
          }
          else
          if (args[1] === 'off') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              timeout: 'off',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Затримка часу відповіді команди **${args[2]}** успішно вимкнена.`);
            }
          }
        }

        // embed
        if (args[0] === 'embed' || args[0] === 'emb') {

          // embed value command

          if (!args[1]) {
            return msg.channel.send('Додайте: on / off.');
          }

          if (args[1] === 'on') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              embed: 'on',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Відповідь команди **${args[2]}** тепер відображатиметься у вбудованому повідомленні.`);
            }
          }
          else
          if (args[1] === 'off') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              embed: 'off',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Вбудоване повідомлення відповіді команди **${args[2]}** успішно вимкнене.`);
            }
          }
        }

        // color
        if (args[0] === 'color') {

          // color value command

          if (!args[1]) {
            return msg.channel.send('Додайте: 5c68ee або off.');
          }
          else
          if (args[1] === 'off') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              color: 'off',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Колір вбудованого повідомлення команди **${args[2]}** успішно вимкнений.`);
            }
          }
          else {
            if (!args[2]) {
              const embedColor = new MessageEmbed()
                .setColor(`#${args[1]}`)
                .setDescription('Це зразок кольору. Не забудьте додати команду зі списку.');
              return msg.channel.send({ embeds: [embedColor] });
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const embedColor = new MessageEmbed()
              .setColor(`#${args[1]}`)
              .setDescription('Зразок кольору.');
            const sendColor = msg.channel.send({ embeds: [embedColor] });

            if (!sendColor) {
              return msg.channel.send('Вкажіть дійсне значення кольору. <https://www.w3schools.com/colors/colors_picker.asp>');
            }

            const update = await own.update({
              color: `#${args[1]}`,
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Відповідь команди **${args[2]}** тепер має колір вбудованого повідомлення.`);
            }
          }
        }

        // prefix
        if (args[0] === 'prefix' || args[0] === 'pref') {

          // prefix value command

          if (!args[1]) {
            return msg.channel.send('Додайте: word / any / on.');
          }

          if (args[1] === 'on') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });

            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              prefix: 'on',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Відповідь команди **${args[2]}** тепер відображатиметься у вбудованому повідомленні.`);
            }
          }
          else
          if (args[1] === 'word') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });


            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              prefix: 'word',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Тепер ваша команди **${args[2]}**, це окреме слово в реченні.`);
            }
          }
          else
          if (args[1] === 'any') {
            if (!args[2]) {
              return msg.channel.send('Додайте: Команду зі списку.');
            }

            const lOwn = await own.findOne({ where: { command: `${args[2]}`, Gid: `${msg.guild.id}` } });


            if (!lOwn) {
              return msg.channel.send(`Команда: **${args[2]}** не знайдена.`);
            }

            const update = await own.update({
              prefix: 'any',
            }, {
              where: {
                name: 'own',
                command: `${args[2]}`,
                Gid: `${msg.guild.id}`,
              },
            });
            if (update) {
              msg.channel.send(`Тепер ваша команда **${args[2]}**, це будь-яке значення в реченні.`);
            }
          }
        }

        // edit
        if (args[0] === 'edit') {

          // edit command answer

          if (!args[1]) {
            return msg.channel.send('Додайте: Команду зі списку.');
          }

          const lOwn = await own.findOne({ where: { command: `${args[1]}`, Gid: `${msg.guild.id}` } });

          if (!lOwn) {
            return msg.channel.send(`Команда: **${args[1]}** не знайдена.`);
          }

          if (!args[2]) {
            return msg.channel.send('Додайте: Нову відповідь.');
          }

          const update = await own.update({
            description: `${args2l}`,
          }, {
            where: {
              name: 'own',
              command: `${args[1]}`,
              Gid: `${msg.guild.id}`,
            },
          });
          if (update) {
            msg.channel.send(`Відповідь команди **${args[2]}** успішно оновлена.`);
          }
        }

        // list
        if (args[0] === 'list') {
          const lOwn = await own.findAll({ attributes: ['command', 'prefix'], where: { Gid: `${msg.guild.id}` } });

          const myCommand = lOwn.map(l => l.command).join('\n') || '0';
          const myPrefix = lOwn.map(l => l.prefix).join('\n') || '0';

          msg.channel.send(`Команда:\n${myCommand} ${myPrefix}`);
        }
      }
    }
  },
};
