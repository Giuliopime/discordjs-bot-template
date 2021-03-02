const fs = require('fs');
const path = require('path');
const Discord = require('discord.js-light');
const Logger = require('../utils/logger');

// Discord collection are simply an extended map (https://discord.js.org/#/docs/collection/master/class/Collection)
const commands = new Discord.Collection();

// Function to require all the commands from the commands folder recursively
// and adds them to the commands collection
function registerCommands(dir) {
   fs.readdir(dir, (e, files) => {
      if (e) {
         throw e;
      }

      files.forEach((file) => {
         const filepath = path.resolve(dir, file);

         fs.stat(filepath, (_, stats) => {
            if (stats.isDirectory()) {
               registerCommands(filepath);
            } else if (stats.isFile() && file.endsWith('.js')) {
               const command = require(filepath);

               // Check for duplicate command names
               if (commands.has(command.name.toLowerCase())) {
                  Logger.error(`Command name duplicate: ${command.name}`);
                  process.exit();
               }
               // Check for duplicate command aliases
               if (commands.some((cmd) => cmd.aliases.some((a) => command.aliases.includes(a)))) {
                  Logger.error(`Command alias duplicate: ${command.aliases}`);
                  process.exit();
               }

               commands.set(command.name.toLowerCase(), command);
            }
         });
      });
   });
}

registerCommands(path.join(__dirname, '../', '../', 'commands'));

// Function used to recursively find a file
function traverse(dir, filename) {
   // eslint-disable-next-line no-restricted-syntax
   for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const direntPath = path.join(dir, dirent.name);

      if (dirent.isDirectory()) {
         const result = traverse(direntPath, filename);
         if (result) {
            return result;
         }
      } else if (dirent.name === `${filename}.js`) {
         return direntPath;
      }
   }
   return null;
}

module.exports = {
   getCommand(commandName) {
      return commands.get(commandName.toLowerCase())
         || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName.toLowerCase()));
   },

   getCommandsByCategory(category) {
      return commands.filter((cmd) => cmd.category.toLowerCase() === category.toLowerCase());
   },

   getAllCommands() {
      return commands;
   },

   reloadCommand(commandName) {
      // Find the command in the commands collection
      const command = this.getCommand(commandName);

      if (!command) {
         return `There is no command with name or alias \`${commandName}\`.`;
      }

      // Finds the path of the command
      const commandPath = traverse(path.join(__dirname, '../../commands'), command.name);
      if (!commandPath) {
         return 'File not found';
      }

      // Un-caches the command
      delete require.cache[require.resolve(commandPath)];

      // Re-caches the command
      try {
         const newCommand = require(commandPath);
         commands.set(newCommand.name.toLowerCase(), newCommand);
         return `Command \`${command.name}\` successfully reloaded!`;
      } catch (err) {
         return `There was an error while reloading a command \`${command.name}\`:\n\`${err}\``;
      }
   },

   async getCommandData(message, prefix) {
      const msgContent = message.content;
      let command;
      let args;

      // Checks if the message contains only the bot mention
      if (msgContent.trim().toLowerCase() === `<@!${message.client.user.id}>`
         || msgContent.trim().toLowerCase() === `<@${message.client.user.id}>`) {
         command = commands.get('mention');
      }

      if (command) {
         args = msgContent.slice(2 + command.name.length).split(/ +/);
         args.shift();
      }

      if (!command) {
         // Remove prefix / mention from the message content
         // and splits the message by spaces into the args array
         if (msgContent.startsWith(`<@!${message.client.user.id}>` || `<@${message.client.user.id}>`)) {
            args = msgContent.slice(23).split(/ +/);
         } else if (msgContent.toLowerCase().startsWith(prefix)) {
            args = msgContent.slice(prefix.length).split(/ +/);
         }

         if (args) {
            // Uses the first arg as command name and removes it from the args array
            const commandName = args.shift().toLowerCase();
            command = commands.get(commandName)
               || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
         }
      }

      return { command, args };
   },

   async runCommand(ctx) {
      const command = commands.get(ctx.commandName.toLowerCase())
         || commands.find((cmd) => cmd.aliases && cmd.aliases.includes(ctx.commandName.toLowerCase()));
      try {
         await command.run(ctx);
         Logger.command(ctx);
         return null;
      } catch (err) {
         Logger.error(`Error while executing the command ${ctx.commandName}`, err);
         return err;
      }
   },
};
