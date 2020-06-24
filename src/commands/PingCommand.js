const EmbedBuilder = require('../utils/EmbedBuilder.js');

class PingCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"ping";
        this.description = "Returns the ping of server and client.";
    }
    
    onCommand(message, commandArgs){
        var embed = new EmbedBuilder().build()
            .setDescription(`Pong! Latency is ${new Date().getTime() - message.createdTimestamp}ms.`)
        message.channel.send(embed);
    }
}

module.exports = PingCommand