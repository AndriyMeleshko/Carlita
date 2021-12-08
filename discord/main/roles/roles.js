const env = process.env;

module.exports.ready = {
  Roles: async () => {
    setInterval(() => {
      const ready = require('../../../discord/discord.js');
      const Guilds = ready.server.guild;

      Guilds.map(async guild => {
        if (guild.id === env.clientGuildId) {
          const members = await guild.members.fetch();
          members.map(async memb => {
            const Pending = guild.roles.cache.find(role => role.name === 'Pending');

            const Visitor = guild.roles.cache.find(role => role.name === 'Visitor');
            const System = guild.roles.cache.find(role => role.name === 'System');
            const Verified = guild.roles.cache.find(role => role.name === 'Verified');
            const MFA = guild.roles.cache.find(role => role.name === 'MFA');

            if (memb.pending === true) {
              if (Pending) {
                memb.roles.add(Pending);
              }
            }

            if (memb.user.bot === false) {
              if (Visitor) {
                memb.roles.add(Visitor);
              }
            }

            if (memb.user.system === true) {
              if (System) {
                memb.roles.add(System);
              }
            }

            if (memb.user.verified === true) {
              if (Verified) {
                memb.roles.add(Verified);
              }
            }

            if (memb.user.mfaEnabled === true) {
              if (MFA) {
                memb.roles.add(MFA);
              }
            }
          });
        }
      });
    }, 60000);
  },
};
