const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class Ping extends Command{
    constructor(commandLoader){
        super(commandLoader, "ping", "Returns the ping of bot and user.");
    }
    
    execute(message, commandArgs){
        message.channel.sendTyping()
        
        var embed = {
            color: Color.random(),
            description: `Pong! Latency is ${new Date().getTime() - message.timestamp}ms.`
        }
            
        message.channel.createMessage({embed: embed});
    }
}

module.exports = Ping