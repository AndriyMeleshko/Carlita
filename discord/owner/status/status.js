const tServ = require('../../../discord/main/server/server.js');

const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env;

const { MessageEmbed } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/owner/status/status.sqlite',
});

const status = sequelize.define('status', {
  title: Sequelize.TEXT,
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  url: Sequelize.STRING,
  status: Sequelize.STRING,
  username: Sequelize.STRING,
  avatar: Sequelize.STRING,
});

status.sync();

module.exports = { status };

/*
0 PLAYING
1 STREAMING
2 LISTENING
3 WATCHING
4 CUSTOM_STATUS
5 COMPETING
*/

module.exports.msg = {
  Status: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;
    if (!fs.existsSync('./discord/owner/status/status.sqlite')) return;

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    const Strip300 = env.stripmsg300;

    const lStatus = await status.findOne({ where: { title: 'status' } });

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const args1 = msg.content.slice(myPref.length).split(/ +/);
    const args1l = args1.slice(2).join(' ');

    if (command === 'status') {
      if (!args.length) {
        const embed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Status')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Warning!', value: 'Add: online / idle / invisible / dnd', inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        return msg.channel.send({ embeds: [embed] });
      }

      if (args[0] === 'online') {
        if (!lStatus) {
          const create = await status.create({
            title: 'status',
            status: 'online',
          });
          if (create) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Status: ${create.status}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
        else
        if (lStatus) {
          const update = await status.update({
            status: 'online',
          }, {
            where: {
              title: 'status',
            },
          });
          if (update) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'Status: ONLINE', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
      }

      if (args[0] === 'idle') {
        if (!lStatus) {
          const create = await status.create({
            title: 'status',
            status: 'idle',
          });
          if (create) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Status: ${create.status}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
        else
        if (lStatus) {
          const update = await status.update({
            status: 'idle',
          }, {
            where: {
              title: 'status',
            },
          });
          if (update) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'Status: IDLE', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
      }

      if (args[0] === 'invisible') {
        if (!lStatus) {
          const create = await status.create({
            title: 'status',
            status: 'invisible',
          });
          if (create) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Status: ${create.status}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
        else
        if (lStatus) {
          const update = await status.update({
            status: 'invisible',
          }, {
            where: {
              title: 'status',
            },
          });
          if (update) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'Status: INVISIBLE', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
      }

      if (args[0] === 'dnd') {
        if (!lStatus) {
          const create = await status.create({
            title: 'status',
            status: 'dnd',
          });
          if (create) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Status: ${create.status}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
        else
        if (lStatus) {
          const update = await status.update({
            status: 'dnd',
          }, {
            where: {
              title: 'status',
            },
          });
          if (update) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: 'Status: DND', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
      }

      if (args[0] === 'name') {
        if (!args[1]) {
          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Status')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: Content.', inline: true },
            )
            .setImage(Strip300)
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [embed] });
        }

        if (!lStatus) {
          const create = await status.create({
            title: 'status',
            name: `${args1l}`,
          });
          if (create) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Name: ${args1l}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
        else
        if (lStatus) {
          const update = await status.update({
            name: `${args1l}`,
          }, {
            where: {
              title: 'status',
            },
          });
          if (update) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Congratulations!', value: `Name: ${args1l}`, inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }
        }
      }

      if (args[0] === 'type') {
        if (!args[1]) {
          const embed = new MessageEmbed()
            .setAuthor('Discord', '', 'https://discord.com/')
            .setDescription('Discord Status')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Add: 1 / 2 / 3 / 5.', inline: true },
            )
            .setImage(Strip300)
            .setFooter('Discord', env.discordgif);
          return msg.channel.send({ embeds: [embed] });
        }

        /*
0 PLAYING
1 STREAMING
2 LISTENING
3 WATCHING
4 CUSTOM_STATUS
5 COMPETING
*/

        if (args[1] === '1') {
          if (!args[2]) {
            const embed = new MessageEmbed()
              .setAuthor('Discord', '', 'https://discord.com/')
              .setDescription('Discord Status')
              .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Warning!', value: 'Add: Url', inline: true },
              )
              .setImage(Strip300)
              .setFooter('Discord', env.discordgif);
            msg.channel.send({ embeds: [embed] });
          }

          if (!lStatus) {
            const create = await status.create({
              title: 'status',
              type: 'STREAMING',
              url: `${args[2]}`,
            });
            if (create) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: STREAMING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
          else
          if (lStatus) {
            const update = await status.update({
              type: 'STREAMING',
              url: `${args[2]}`,
            }, {
              where: {
                title: 'status',
              },
            });
            if (update) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: STREAMING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }

        if (args[1] === '2') {
          if (!lStatus) {
            const create = await status.create({
              title: 'status',
              type: 'LISTENING',
            });
            if (create) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: LISTENING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
          else
          if (lStatus) {
            const update = await status.update({
              type: 'LISTENING',
            }, {
              where: {
                title: 'status',
              },
            });
            if (update) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: LISTENING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }

        if (args[1] === '3') {
          if (!lStatus) {
            const create = await status.create({
              title: 'status',
              type: 'WATCHING',
            });
            if (create) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: WATCHING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
          else
          if (lStatus) {
            const update = await status.update({
              type: 'WATCHING',
            }, {
              where: {
                title: 'status',
              },
            });
            if (update) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: WATCHING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }

        if (args[1] === '5') {
          if (!lStatus) {
            const create = await status.create({
              title: 'status',
              type: 'COMPETING',
            });
            if (create) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: COMPETING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
          else
          if (lStatus) {
            const update = await status.update({
              type: 'COMPETING',
            }, {
              where: {
                title: 'status',
              },
            });
            if (update) {
              const embed = new MessageEmbed()
                .setAuthor('Discord', '', 'https://discord.com/')
                .setDescription('Discord Status')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Congratulations!', value: 'Type: COMPETING', inline: true },
                )
                .setImage(Strip300)
                .setFooter('Discord', env.discordgif);
              msg.channel.send({ embeds: [embed] });
            }
          }
        }
      }

      if (args[0] === 'list') {
        const lStatuses = await status.findAll({ attributes: ['title', 'name', 'status', 'avatar', 'username', 'type', 'url'] });

        const Title = lStatuses.map(l => l.title).join('\n') || '0';
        const Name = lStatuses.map(l => l.name).join('\n') || '0';
        const Status = lStatuses.map(l => l.status).join('\n') || '0';
        const Avatar = lStatuses.map(l => l.avatar).join('\n') || '0';
        const UserName = lStatuses.map(l => l.username).join('\n') || '0';
        const Type = lStatuses.map(l => l.type).join('\n') || '0';
        const Url = lStatuses.map(l => l.url).join('\n') || '0';

        const embed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Status')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Title!', value: `${Title}`, inline: true },
            { name: 'Name', value: `${Name}`, inline: true },
            { name: 'Status', value: `${Status}`, inline: true },
            { name: 'Avatar', value: `${Avatar}`, inline: true },
            { name: 'UserName', value: `${UserName}`, inline: true },
            { name: 'Type', value: `${Type}`, inline: true },
            { name: 'Url', value: `${Url}`, inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [embed] });
      }
    }
  },
};
