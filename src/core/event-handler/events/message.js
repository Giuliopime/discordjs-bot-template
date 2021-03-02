const commandHandler = require('../../command-handler/command-handler');
const permissionsHandler = require('../../discord-utils/permissions-handler');
const cooldownManager = require('../../utils/cooldowns-manager');
const embeds = require('../../graphics/embeds');
const Ctx = require('../../command-handler/Ctx');
const commandConfigs = require('../../../config/commands-config.json');

module.exports = async (client, message) => {
   // Some example code...

   // Don't listen to bot messages
   if (message.author.bot) {
      return;
   }

   // Don't listen to DMs
   if (!message.guild) {
      return;
   }

   const { guild, channel, member } = message;


   // COMMAND CHECK

   const commandCheck = await commandHandler.getCommandData(message, commandConfigs.prefix);
   if (!commandCheck.command) {
      return;
   }

   const { command, args } = commandCheck;

   if (command.reqArgs && !args.length) {
      await channel.send(embeds.error('The command is missing some arguments'));
      return;
   }

   // PERMISSIONS CHECK
   const missingTextPerms = permissionsHandler.checkTextPerms(channel);
   if (missingTextPerms.length > 0) {
      await channel.send(embeds.error(`Missing text channel permissions:\n- ${missingTextPerms.join('\n- ')}`));
      return;
   }

   const missingGuildPerms = permissionsHandler.checkGuildPerms(guild);
   if (missingGuildPerms.length > 0) {
      await channel.send(embeds.error(`Missing server permissions:\n- ${missingGuildPerms.join('\n- ')}`));
      return;
   }


   // COOLDOWN CHECK
   const userOnCooldown = await cooldownManager.isCmdOnCooldown(member.id, command);
   if (userOnCooldown) {
      await channel.send(embeds.error('Cool down mate'));
      return;
   }


   /*
     TIP MESSAGES
      Generating a random number between 1 and randMax
      If the resulting value equals 1 then send a tip message
    */
   const randMax = 10;
   if ((Math.floor(Math.random() * randMax) + 1) === 1) {
      await channel.send(embeds.tip());
   }


   // EXECUTE THE COMMAND
   const ctx = new Ctx(message, command.name, args);

   const error = await commandHandler.runCommand(ctx);
   if (error) {
      await channel.send(embeds.error(`Error while executing the command ${command.name}`));
   }
};
