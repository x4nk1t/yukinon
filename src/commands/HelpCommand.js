const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js')

class HelpCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"help";
        this.description = "Shows the command info.";
    }
    
    onCommand(message, commandArgs){
        var commands = this.commandLoader.loadedCommands;
        var description = "";
        
        for(var i = 0; i < commands.length; i++){
            const commandName = commands[i].commandName;
            const usage = commands[i].getCommandClass().usage;
            const commandDescription = commands[i].getCommandClass().description;
            
            description += '**'+ commandName + "**\n" + commandDescription + '\n Usage: ' + usage +'\n';
        }
        
        var embed = new EmbedBuilder().build()
            .setTitle('-= Help =-')
            .setDescription(description)
            .setTimestamp()
        
        message.channel.send(embed)
    }
}

module.exports = HelpCommand