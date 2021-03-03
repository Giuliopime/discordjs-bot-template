# Command handler
It's used to register all the bot commands placed under `/src/commands` and has also some utility methods, for example:
- getters for the commands
- a method to check if a message is a command
- a method to reload a command so that you don't need to restart the bot just to change some code in a command file

# CTX
The CTX (Command context) is a class that's used to store some useful informations about the context of a command, for example:
- the member who ran the command
- the guild in which it was ran
- the channel
- and more...

Every command should have a `run` method which receives as an argument the CTX.  
(You can always replace that with a system of your liking)
