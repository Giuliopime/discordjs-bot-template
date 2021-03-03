# Event handler
A simple event handler for the bot.  
It permits the bot to listen by default to some useful events like:
- `ready`
- `error`
- `shardError`
- `warn`

There is also some commented code to receive `messageReactionAdd` events on old / uncached messages.  

Then it automatically bounds all the event files under `/src/core/event-handler/events` to the bot client.  
Head over the `events` folder to understand how it works.
