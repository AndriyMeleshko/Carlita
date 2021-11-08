const env = process.env;

const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports.msg = {
  Webhook: async (msg) => {
    if (msg.author.bot) return;

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    const Strip300 = env.stripmsg300;

    // Web Embed Test
    if (msg.channel.id === '906687203315441704') {
      const args = msg.content.split(/ +/);

      const webhookTest = new WebhookClient({ url: env.webhookTest });

      const embed = new MessageEmbed()
        .setAuthor('Discord', '', 'https://discord.com/')
        .setDescription('Discord Announcement')
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: 'News', value: `${args.join(' ')}` },
        )
        .setImage(Strip300)
        .setFooter('Discord', env.discordgif);

      webhookTest.send({
        embeds: [embed],
        username: env.clientName,
        avatarURL: env.clientAva,
      });
    }

    // Web Embed News
    if (msg.channel.id === '906645734990938213') {
      const args = msg.content.split(/ +/);

      const webhookNews = new WebhookClient({ url: env.webhookNews });

      const embed = new MessageEmbed()
        .setAuthor('Discord', '', 'https://discord.com/')
        .setDescription('Discord Announcement')
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: 'News', value: `${args.join(' ')}` },
        )
        .setImage(Strip300)
        .setFooter('Discord', env.discordgif);

      webhookNews.send({
        embeds: [embed],
        username: env.clientName,
        avatarURL: env.clientAva,
      });
    }

    // Web Embed Own
    if (msg.channel.id === '827997363837861988') {
      const args = msg.content.split(/ +/);

      const webhookOwn = new WebhookClient({ url: env.webhookOwn });

      const embed = new MessageEmbed()
        .setAuthor('Discord', '', 'https://discord.com/')
        .setDescription('Discord Announcement')
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: 'News', value: `${args.join(' ')}` },
        )
        .setImage(Strip300)
        .setFooter('Discord', env.discordgif);

      webhookOwn.send({
        embeds: [embed],
        username: env.clientName,
        avatarURL: env.clientAva,
      });
    }
  },
};
