### This folder is for event files.
If you want to listen to a specific event just create a new file with the same name
as the event name.  

For example, if you want to listen to the `messageReactionAdd` event, simply create a new file in this folder
called `messageReactionAdd.js`

To code to be executed when the event is fired should go inside the default exported module, so something above the following lines:  
```js
module.exports = async (client, data) => {
   // handle the data in here
};
```
The Discord client of the bot is always passed as the first parameter of the function
