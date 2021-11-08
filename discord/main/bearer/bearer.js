const tableTime = require('../../../time/time.js');
const tableServ = require('../../../discord/main/server/server.js');

const Sequelize = require('sequelize');
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

const env = process.env;

const { MessageEmbed } = require('discord.js');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  // SQLite only
  storage: './discord/main/bearer/bearer.sqlite',
});


const bearer = sequelize.define('bearer', {
  name: Sequelize.TEXT,
  timeplus: Sequelize.STRING,
  timeplus2: Sequelize.STRING,
  accesstoken: Sequelize.STRING,
  refreshtoken: Sequelize.STRING,
  expiresin: Sequelize.STRING,
  scope: Sequelize.STRING,
  tokentype: Sequelize.STRING,
});

module.exports = { bearer };

bearer.sync();

setInterval(async () => {
  if (!fs.existsSync('./discord/main/bearer/bearer.sqlite')) bearer.sync();

  const lTime = await tableTime.time.findOne({ where: { name: 'time' } });

  const lBearer = await bearer.findOne({ where: { name: 'bearer' } });

  if (!lBearer) {
    fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.clientTwitchId}&client_secret=${env.clientTwitchSecret}&grant_type=client_credentials`, {
      method: 'post',
    })
      .then(response => response.json())
      .then(async jsonPost => {
        const create = await bearer.create({
          name: 'bearer',
          timeplus: `${moment().utc().locale('en').add(2, 'M').format()}`,
          timeplus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
          accesstoken: `Bearer ${jsonPost.access_token}`,
          refreshtoken: `${jsonPost.refresh_token}`,
          expiresin: `${jsonPost.expires_in}`,
          scope: `${jsonPost.scope}`,
          tokentype: `${jsonPost.token_type}`,
        });
        if (create) {
          console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Bearer Created`);
        }
      })
      .catch(err => console.error(err));
  }
  else if (lBearer) {
    const timeReal = `${moment().utc().locale('en').format()}`;
    const timePlus = `${lBearer.timeplus}`;
    if (!timePlus) return;

    if (timeReal > timePlus) {
      fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.clientTwitchId}&client_secret=${env.clientTwitchSecret}&grant_type=client_credentials`, {
        method: 'post',
      })
        .then(response => response.json())
        .then(async jsonPost => {
          const update = await bearer.update({
            timeplus: `${moment().utc().locale('en').add(2, 'M').format()}`,
            timeplus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
            accesstoken: `Bearer ${jsonPost.access_token}`,
            refreshtoken: `${jsonPost.refresh_token}`,
            expiresin: `${jsonPost.expires_in}`,
            scope: `${jsonPost.scope}`,
            tokentype: `${jsonPost.token_type}`,
          }, {
            where: {
              name: 'bearer',
            },
          });
          if (update) {
            console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Bearer Update`);
          }
        })
        .catch(err => console.error(err));
    }
  }
}, 60000);

module.exports.msg = {
  Bearer: async (msg) => {
    if (msg.author.bot) return;

    if (!fs.existsSync('./discord/main/bearer/bearer.sqlite')) return;
    if (!fs.existsSync('./discord/main/server/server.sqlite')) return;

    const lTime = await tableTime.time.findOne({ where: { name: 'time' } });

    const lServ = await tableServ.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    if (command === 'bearer') {
      if (!args.length) {
        const exampleEmbed = new MessageEmbed()
          .setAuthor('Twitch', '', 'https://www.twitch.tv/')
          .setDescription('Twitch Bearer')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Warning!', value: 'Add: create / list', inline: true },
            { name: '\u200B', value: '\u200B' },
          )
          .setTimestamp()
          .setFooter('Twitch', env.twitchgif);
        return msg.channel.send({ embeds: [exampleEmbed] });
      }

      if (args[0] === 'create') {
        fetch(`https://id.twitch.tv/oauth2/token?client_id=${env.clientTwitchId}&client_secret=${env.clientTwitchSecret}&grant_type=client_credentials`, {
          method: 'post',
        })
          .then(response => response.json())
          .then(async jsonPost => {
            const create = await bearer.create({
              name: 'bearer',
              timeplus: `${moment().utc().locale('en').add(2, 'M').format()}`,
              timeplus2: `${moment().utc().locale('en').add(2, 'M').format('hh:mm a, dddd D MMMM, YYYY')}`,
              accesstoken: `Bearer ${jsonPost.access_token}`,
              refreshtoken: `${jsonPost.refresh_token}`,
              expiresin: `${jsonPost.expires_in}`,
              scope: `${jsonPost.scope}`,
              tokentype: `${jsonPost.token_type}`,
            });
            if (create) {
              console.log(`${moment().locale('en').add(lTime.time, 'h').format('hh:mm:ss a')} | Bearer Create`);
            }
          })
          .catch(err => console.error(err));
      }

      if (args[0] === 'list') {
        const lBearers = await bearer.findAll({ attributes: ['name', 'timeplus', 'timeplus2', 'accesstoken', 'refreshtoken', 'expiresin', 'scope', 'tokentype'] });

        const nameBearer = lBearers.map(t => t.name).join('\n') || '0';
        const timeplusBearer = lBearers.map(t => t.timeplus).join('\n') || '0';
        const timeplus2Bearer = lBearers.map(t => t.timeplus2).join('\n') || '0';
        const accesstokenBearer = lBearers.map(t => t.accesstoken).join('\n') || '0';
        const refreshtokenBearer = lBearers.map(t => t.refreshtoken).join('\n') || '0';
        const expiresinBearer = lBearers.map(t => t.expiresin).join('\n') || '0';
        const scopeBearer = lBearers.map(t => t.scope).join('\n') || '0';
        const tokentypeBearer = lBearers.map(t => t.tokentype).join('\n') || '0';

        const exampleEmbed = new MessageEmbed()
          .setAuthor('Twitch', '', 'https://www.twitch.tv/')
          .setDescription('Twitch Bearer')
          .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: 'Name', value: `${nameBearer}`, inline: true },
            { name: 'TimePlus', value: `${timeplusBearer}\n${timeplus2Bearer}`, inline: true },
            { name: 'AccessToken', value: `${accesstokenBearer}`, inline: false },
            { name: 'RefreshToken', value: `${refreshtokenBearer}`, inline: true },
            { name: 'ExpiresIn', value: `${expiresinBearer}`, inline: true },
            { name: 'Scope', value: `${scopeBearer}`, inline: true },
            { name: 'TokenType', value: `${tokentypeBearer}`, inline: true },
            { name: '\u200B', value: '\u200B' },
          )
          .setTimestamp()
          .setFooter('Twitch', env.twitchgif);
        msg.channel.send({ embeds: [exampleEmbed] });
      }
    }
  },
};
