const app = require('../../app.json');
const env = process.env;

const tables = require(`../../../${app.app[0].tablesjs}`);

const { EmbedBuilder } = require('discord.js');

module.exports.msg = {
  Send: async (msg, ClientDiscord) => {
    if (msg.author.bot || !msg.guild) return;

    const lServer = await tables.server.findOne({ where: { GuildId: `${msg.guild.id}` } });
    if (!lServer) return;

    const myPref = `${lServer.GuildPrefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).split(/ +/);
    const command = args.shift().toLowerCase();

    const StripMenu = env.StripMenu;
    const DiscordGif = env.DiscordGif;

    if (command === 'send') {

      const args1l = args.slice(1).join(' ');
      const args2l = args.slice(2).join(' ');

      if (!args.length) {

        const embed = new EmbedBuilder()
          .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
          .setDescription('Discord Send')
          .addFields(
            { name: '\u200B', value: '\u200B', inline: true },
            // { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Warning!', value: 'Add: emb <ID> <Content> / <ID> <Content>', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
          )
          .setImage(StripMenu)
          .setFooter({ text: 'Discord', iconURL: DiscordGif });
        return msg.channel.send({ embeds: [embed] });
      }

      if (args[0] === 'emb' || args[0] === 'e') {

        if (!args[1]) {
          const embed = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Send')
            .addFields(
              { name: '\u200B', value: '\u200B', inline: true },
              { name: 'Warning!', value: '<ID> <Content>', inline: true },
              { name: '\u200B', value: '\u200B', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });
          return msg.channel.send({ embeds: [embed] });
        }

        if (!`${args2l}`) {
          const embed = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Send')
            .addFields(
              { name: '\u200B', value: '\u200B', inline: true },
              { name: 'Warning!', value: '<Content>', inline: true },
              { name: '\u200B', value: '\u200B', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });
          return msg.channel.send({ embeds: [embed] });
        }

        const create = await tables.send.create({
          codename: 'send',
          msgid: `${msg.id}`,
          channelsendid: `${args[1]}`,
          channelname: `${msg.channel.name}`,
          channelid: `${msg.channel.id}`,
          guildname: `${msg.guild.name}`,
          guildid: `${msg.guild.id}`,
        });

        if (create) {

          const lSends = await tables.send.findAll({ attributes: [
            'channelsendid',
          ], where: {
            codename: 'send',
            msgid: `${msg.id}`,
          } });

          if (!lSends) return;

          const channelsendid = lSends.map(l => l.channelsendid);

          const channel = ClientDiscord.channels.cache.get(`${channelsendid}`);

          if (!channel) return;

          const embed = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription(`${args2l}`)
            /* .addFields(
              // { name: '\u200B', value: '\u200B', inline: true },
              { name: '\u200B', value: `${args2l}`, inline: true },
            ) */
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });
          const channelsend = channel.send({ embeds: [embed] });

          if (channelsend) {
            await tables.send.destroy({ where: {
              codename: 'send',
              guildid: `${msg.guild.id}`,
            } });
          }
        }
      }
      else

        if (args[0] === 'list' || args[0] === 'l') {

          const lSends = await tables.send.findAll({ attributes: [
            'codename',
            'channelsendid',
            'msgid',
            'channelname',
            'channelid',
            'guildname',
            'guildid',
          ], where: { guildid: `${msg.guild.id}` } });

          const channelsendid = lSends.map(l => l.channelsendid).join('\n') || '0';

          const embed = new EmbedBuilder()
            .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
            .setDescription('Discord Send')
            .addFields(
              { name: '\u200B', value: '\u200B', inline: true },
              { name: 'Channel Send ID', value: `${channelsendid}`, inline: true },
              { name: '\u200B', value: '\u200B', inline: true },
            )
            .setImage(StripMenu)
            .setFooter({ text: 'Discord', iconURL: DiscordGif });
          msg.channel.send({ embeds: [embed] });
        }
        else {

          if (!args[0]) {
            const embed = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<ID> <Content>', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });
            return msg.channel.send({ embeds: [embed] });
          }

          if (!`${args1l}`) {
            const embed = new EmbedBuilder()
              .setAuthor({ name: 'Discord', url: 'https://discord.com/' })
              .setDescription('Discord Send')
              .addFields(
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Warning!', value: '<Content>', inline: true },
              )
              .setImage(StripMenu)
              .setFooter({ text: 'Discord', iconURL: DiscordGif });
            return msg.channel.send({ embeds: [embed] });
          }

          const create = await tables.send.create({
            codename: 'send',
            msgid: `${msg.id}`,
            channelsendid: `${args[0]}`,
            channelname: `${msg.channel.name}`,
            channelid: `${msg.channel.id}`,
            guildname: `${msg.guild.name}`,
            guildid: `${msg.guild.id}`,
          });

          if (create) {
            const lSends = await tables.send.findAll({ attributes: [
              'channelsendid',
            ], where: {
              codename: 'send',
              msgid: `${msg.id}`,
            } });

            if (!lSends) return;

            const channelsendid = lSends.map(l => l.channelsendid);

            const channel = ClientDiscord.channels.cache.get(`${channelsendid}`);

            if (!channel) return;

            const channelsend = channel.send(`${args1l}`);

            if (channelsend) {
              await tables.send.destroy({ where: {
                codename: 'send',
                guildid: `${msg.guild.id}`,
              } });
            }
          }
        }
    }
  },
};
