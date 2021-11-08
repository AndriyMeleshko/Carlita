const tBearer = require('../../discord/main/bearer/bearer.js');
const tServ = require('../../discord/main/server/server.js');

const randomAnimal = require('random-animal.js');
const fetch = require('node-fetch');
const fs = require('fs');

const env = process.env;

const { MessageEmbed } = require('discord.js');

module.exports.msg = {
  Commands: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/bearer/bearer.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const Strip300 = env.stripmsg300;

    const lBearer = await tBearer.bearer.findOne({ where: { name: 'bearer' } });
    if (!lBearer) return;

    const options = {
      method: 'get',
      headers: {
        'Client-ID': env.clientTwitchId,
        'Authorization': `${lBearer.accesstoken}`,
      },
    };

    const lServ = await tServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;
    const myLang = `${lServ.guildlanguage}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping' || command === 'пінг') {
      if (myLang === 'en') {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Ping')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Ping', value: `${new Date().getTime() - msg.createdTimestamp} ms`, inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }

      if (myLang === 'uk') {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Ping')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Ping', value: `${new Date().getTime() - msg.createdTimestamp} mс`, inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }
    }

    if (command === 'cat' || command === 'кіт') {
      randomAnimal.randomCat().then(cat => {
        msg.channel.send(cat);
      })
        .catch(err => console.error(err));
    }

    if (command === 'dog' || command === 'пес') {
      randomAnimal.randomDog().then(dog => {
        msg.channel.send(dog);
      })
        .catch(err => console.error(err));
    }

    if (command === 'topic' || command === 'тема') {
      if (myLang === 'en') {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Topic')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Topic', value: `${msg.channel.topic || 'The topic is missing.'}`, inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }

      if (myLang === 'uk') {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Discord', '', 'https://discord.com/')
          .setDescription('Discord Topic')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Тема', value: `${msg.channel.topic || 'Тема відсутня.'}`, inline: true },
          )
          .setImage(Strip300)
          .setFooter('Discord', env.discordgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }
    }

    if (command === 'twitch') {
      if (!args.length) {
        if (myLang === 'en') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Twitch', '', 'https://www.twitch.tv/')
            .setDescription('Twitch Channel')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Warning!', value: 'Enter the name of the Twitch channel.', inline: true },
            )
            .setImage(Strip300)
            .setFooter('Twitch', env.twitchgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }

        if (myLang === 'uk') {
          const exampleEmbed = new MessageEmbed()
            .setAuthor('Twitch', '', 'https://www.twitch.tv/')
            .setDescription('Twitch Channel')
            .addFields(
              { name: '\u200B', value: '\u200B' },
              { name: 'Увага!', value: 'Вкажіть ім\'я каналу Twitch.', inline: true },
            )
            .setImage(Strip300)
            .setFooter('Twitch', env.twitchgif);
          return msg.channel.send({ embeds: [exampleEmbed] });
        }
      }

      fetch(`${env.users}${args[0]}`, options)
        .then(response => response.json())
        .then(async jsonUser => {
          if (!jsonUser.data[0]) {
            if (myLang === 'en') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Channel')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Warning!', value: `Twitch channel **${args[0]}** not found.\nMake sure you enter the name correctly.`, inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }

            if (myLang === 'uk') {
              const exampleEmbed = new MessageEmbed()
                .setAuthor('Twitch', '', 'https://www.twitch.tv/')
                .setDescription('Twitch Channel')
                .addFields(
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Увага!', value: `Канал Twitch **${args[0]}** не знайдений.\nПеревірте, чи правильно ви вказали ім'я.`, inline: true },
                )
                .setImage(Strip300)
                .setFooter('Twitch', env.twitchgif);
              return msg.channel.send({ embeds: [exampleEmbed] });
            }
          }

          fetch(`${env.streams}${args[0]}`, options)
            .then(response => response.json())
            .then(jsonStream => {
              if (!jsonStream.data[0]) {
                const exampleEmbed = new MessageEmbed()
                  .setAuthor(`${jsonUser.data[0].display_name}`, '', `https://www.twitch.tv/${jsonUser.data[0].login}`)
                  .setDescription('Twitch Channel')
                  .setThumbnail(`${jsonUser.data[0].profile_image_url}`)
                  .addFields(
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Status', value: 'Offline', inline: true },
                    { name: 'Category', value: '0', inline: true },
                    { name: 'Category ID', value: '0', inline: true },
                    { name: 'Channel ID', value: `${jsonUser.data[0].id || '0'}`, inline: true },
                    { name: 'Staff / Admin', value: `${jsonUser.data[0].type || '0'}`, inline: true },
                    { name: 'Partner / Affiliate', value: `${jsonUser.data[0].broadcaster_type || '0'}`, inline: true },
                    { name: 'View Count', value: `${jsonUser.data[0].view_count || '0'}`, inline: true },
                    { name: 'Viewer Count', value: '0', inline: true },
                    { name: 'Language', value: '0', inline: true },
                  )
                  .setImage(jsonUser.data[0].offline_image_url || 'http://blog.hdwallsource.com/wp-content/uploads/2018/01/twitch-icon-logo-wallpaper-62702-64683-hd-wallpapers.jpg')
                  .setFooter('Twitch', env.twitchgif);
                return msg.channel.send({ embeds: [exampleEmbed] });
              }

              const d = new Date(jsonStream.data[0].started_at);
              const d2 = new Date();
              const d3 = d2 - d;
              const y2 = Math.floor((d3 / (1000 * 60 * 60 * 24)) % 60).toString();
              const y3 = Math.floor((d3 / (1000 * 60 * 60)) % 60).toString();
              const y4 = Math.floor((d3 / (1000 * 60)) % 60).toString();

              fetch(`${env.games}${jsonStream.data[0].game_id}`, options)
                .then(response => response.json())
                .then(jsonGame => {
                  if (!jsonGame.data[0]) {
                    const exampleEmbed = new MessageEmbed()
                      .setAuthor(`${jsonUser.data[0].display_name}`, '', `https://www.twitch.tv/${jsonUser.data[0].login}`)
                      .setDescription(`Twitch Channel\n\n${jsonStream.data[0].title || '0'}`)
                      .setThumbnail(`${jsonUser.data[0].profile_image_url}`)
                      .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Category', value: `${jsonGame.data[0].name || '0'}`, inline: true },
                        { name: 'Category ID', value: `${jsonStream.data[0].id || '0'}`, inline: true },
                        { name: 'Channel ID', value: `${jsonUser.data[0].id || '0'}`, inline: true },
                        { name: 'Staff / Admin', value: `${jsonUser.data[0].type || '0'}`, inline: true },
                        { name: 'Partner / Affiliate', value: `${jsonUser.data[0].broadcaster_type || '0'}`, inline: true },
                        { name: 'View Count', value: `${jsonUser.data[0].view_count || '0'}`, inline: true },
                        { name: 'Viewer Count', value: `${jsonStream.data[0].viewer_count || '0'}`, inline: true },
                        { name: 'Language', value: `${jsonStream.data[0].language || '0'}`, inline: true },
                      )
                      .setImage(`https://static-cdn.jtvnw.net/ttv-boxart/${jsonGame.data[0].name.replace(/ /g, '%20')}-100x133.jpg`)
                      .setFooter('Twitch', env.twitchgif);
                    return msg.channel.send({ embeds: [exampleEmbed] });
                  }
                  else {
                    const exampleEmbed = new MessageEmbed()
                      .setAuthor(`${jsonUser.data[0].display_name}`, '', `https://www.twitch.tv/${jsonUser.data[0].login}`)
                      .setTitle(`${jsonGame.data[0].name}`)
                      .setURL(`https://www.twitch.tv/directory/game/${jsonGame.data[0].name.replace(/ /g, '%20').toLowerCase() || '0'}`)
                      .setDescription(`Twitch Channel\n\n${jsonStream.data[0].title || '0'}`)
                      .setThumbnail(`${jsonUser.data[0].profile_image_url}`)
                      .addFields(
                        { name: '\u200B', value: '\u200B' },
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Category', value: `${jsonGame.data[0].name || '0'}`, inline: true },
                        { name: 'Category ID', value: `${jsonStream.data[0].id || '0'}`, inline: true },
                        { name: 'Channel ID', value: `${jsonUser.data[0].id || '0'}`, inline: true },
                        { name: 'Staff / Admin', value: `${jsonUser.data[0].type || '0'}`, inline: true },
                        { name: 'Partner / Affiliate', value: `${jsonUser.data[0].broadcaster_type || '0'}`, inline: true },
                        { name: 'View Count', value: `${jsonUser.data[0].view_count || '0'}`, inline: true },
                        { name: 'Viewer Count', value: `${jsonStream.data[0].viewer_count || '0'}`, inline: true },
                        { name: 'Language', value: `${jsonStream.data[0].language || '0'}`, inline: true },
                        { name: 'Uptime', value: `${y2} / ${y3}:${y4}`, inline: true },
                      )
                      .setImage(`https://static-cdn.jtvnw.net/ttv-boxart/${jsonGame.data[0].name.replace(/ /g, '%20')}-100x133.jpg`)
                      .setFooter('Twitch', env.twitchgif);
                    msg.channel.send({ embeds: [exampleEmbed] });
                  }
                })
                .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  },
};
