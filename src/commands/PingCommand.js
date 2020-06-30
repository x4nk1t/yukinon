const Color = require('../utils/Color.js');
const Command = require('./Command.js');

class PingCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "ping", "Returns the ping of bot and user.");
    }
    
    execute(message, commandArgs){
        message.channel.sendTyping()
        
        var embed = Color.random()
            .setDescription(`Pong! Latency is ${new Date().getTime() - message.createdTimestamp}ms.`)
            
        message.channel.stopTyping()
        message.channel.send(embed);
    }
}

module.exports = PingCommand