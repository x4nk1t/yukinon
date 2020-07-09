const Discord = require('discord.js');
const Command = require('../Command.js');

class Ping extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "ping",
            description: "Returns the ping of bot and user."
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`Pong! Latency is ${new Date().getTime() - message.createdTimestamp}ms.`)
            
        message.channel.send(embed);
        message.channel.stopTyping()
    }
}

module.exports = Ping