const EmbedBuilder = require('../utils/EmbedBuilder.js');
const Command = require('./Command.js');

class PingCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "ping", "Returns the ping of server and client.");
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new EmbedBuilder().build()
            .setDescription(`Pong! Latency is ${new Date().getTime() - message.createdTimestamp}ms.`)
            
        message.channel.stopTyping()
        message.channel.send(embed);
    }
}

module.exports = PingCommand