# Commands folder
In this folder you can put js command files or create subdirectories to organize them.  
Everything is already handled in the command handler.  

Here is an example of how a command should look like:
```js
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
   
   async run(ctx) {
      // Code for the command goes here
      // Use the ctx for useful variables
   },
};
```

Remember that you can always customise everything you want to adapt the code-base to your needs.
