const discord = require('discord.js');

class HelpCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
    }
    
    onCommand(message, ...commandArgs){
        var embed = new discord.MessageEmbed()
            .setColor(this.commandLoader.colorArray[Math.floor(Math.random() * this.commandLoader.colorArray.length)])
            .addField('Help Command', 'WIP')
            .setTimestamp()
        
        message.channel.send(embed)
    }
}

module.exports = HelpCommand