const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js')

class HelpCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
    }
    
    onCommand(message, ...commandArgs){
        var embed = new EmbedBuilder().build()
            .setDescription('Help Command \n WIP')
            .setTimestamp()
        
        message.channel.send(embed)
    }
}

module.exports = HelpCommand