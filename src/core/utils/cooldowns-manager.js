const Discord = require('discord.js-light');
const { cooldownsEnabled, defaultCooldownAmount } = require('../../config/commands-config.json');

const cooldowns = new Discord.Collection();

module.exports = {
   // Taken from https://discordjs.guide/command-handling/adding-features.html#cooldowns
   async isCmdOnCooldown(userID, command) {
      if (!cooldownsEnabled) {
         return false;
      }

      if (!cooldowns.has(command.name)) {
         cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || defaultCooldownAmount);

      if (timestamps.has(userID)) {
         const expirationTime = timestamps.get(userID) + cooldownAmount;

         if (now < expirationTime) {
            // const timeLeft = (expirationTime - now) / 1000;
            return true;
         }
      }

      timestamps.set(userID, now);
      return false;
   },
};
