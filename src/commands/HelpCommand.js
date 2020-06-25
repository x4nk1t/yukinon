const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js')

class HelpCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"help";
        this.description = "Shows the command info.";
        
        this.helpContent = "";
    }
    
    onCommand(message, commandArgs){
        if(this.helpContent == ""){
            var commands = this.commandLoader.loadedCommands;
            
            for(var i = 0; i < commands.length; i++){
                const commandName = commands[i].commandName;
                const usage = commands[i].getCommandClass().usage;
                const commandDescription = commands[i].getCommandClass().description;
                
                this.helpContent += '**'+ commandName + "**\n" + commandDescription + '\n Usage: ' + usage +'\n';
            }
        }
        var embed = new EmbedBuilder().build()
            .setTitle('-= Help =-')
            .setDescription(this.helpContent)
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
        
        message.channel.send(embed)
    }
}

module.exports = HelpCommand