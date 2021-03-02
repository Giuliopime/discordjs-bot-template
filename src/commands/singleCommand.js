module.exports = {
   name: 'commandName',
   aliases: ['list', 'of', 'command', 'aliases'],
   description: 'Command description',

   // Whether the command requires arguments
   reqArgs: true,
   // Arguments usage
   usage: '{ @user }',
   // Example usage of the command
   exampleUsage: 'commandName @Giuliopime',

   category: 'command category',

   // Command cooldown in milliseconds
   cooldown: 300,

   // eslint-disable-next-line no-unused-vars
   async run(ctx) {
      // Code for the command goes here
      // Use the ctx for useful variables
   },
};
