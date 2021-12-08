const tServer = require('../../../discord/main/server/server.js');

const env = process.env;

const { MessageEmbed } = require('discord.js');

module.exports.msg = {
  Commands: async (msg) => {
    if (msg.author.bot) return;

    const owner = msg.member.id === env.ownerDiscordId;
    if (!owner) return;

    const lServ = await tServer.server.findOne({ where: { guildid: `${msg.guild.id}` } });
    if (!lServ) return;

    const myPref = `${lServ.guildprefix}`;

    const Strip300 = env.stripmsg300;

    if (!msg.content.startsWith(myPref)) return;
    const args = msg.content.slice(myPref.length).toLowerCase().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'test') {
      const embed = new MessageEmbed()
        .setDescription('Discord\n\n**[The Electrical Life of Louis Wain (2021) - IMDb](https://discord.js.org/)**\n\nThe Electrical Life of Louis Wain: Directed by Will Sharpe. With Benedict Cumberbatch, Claire Foy, Andrea Riseborough, Toby Jones. English artist Louis Wain rises to prominence at the end of the 19th century for his surreal cat paintings that seemed to reflect his declining sanity.')
        .setImage('https://cdn.discordapp.com/attachments/899435573025050624/909855121972817970/MV5BZTVjMjcwNTctNWQ3NS00NzVlLWE4N2ItOTlhMjc1ZTdkMzYyXkEyXkFqcGdeQXVyMjkwOTAyMDU._V1_FMjpg_UX1000_.jpg')
        .setFooter('Discord', env.discordgif);
      msg.channel.send({ embeds: [embed] });
    }
  },
};
