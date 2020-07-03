const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class Ping extends Command{
    constructor(commandLoader){
        super(commandLoader, "ping", "Returns the ping of bot and user.");
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = {
            color: Color.random(),
            description: `Pong! Latency is ${new Date().getTime() - message.createdTimestamp}ms.`
        }
            
        message.channel.send({embed: embed});
        message.channel.stopTyping()
    }
}

module.exports = Ping