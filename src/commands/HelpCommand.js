const discord = require('discord.js');
const EmbedBuilder = require('../utils/EmbedBuilder.js')

class HelpCommand{
    constructor(commandLoader){
        this.commandLoader = commandLoader;
        this.usage = this.commandLoader.prefix +"help [page]";
        this.description = "Shows the command info.";
        
        this.helpContent = [];
        this.helpPerPage = 4;
    }
    
    onCommand(message, commandArgs){
        message.channel.startTyping()
        if(this.helpContent == ""){
            var commands = this.commandLoader.loadedCommands;
            var page = 0;
            
            for(var i = 0; i < commands.length; i++){
                if(i != 0 && i % this.helpPerPage == 0) page++;
                if(this.helpContent[page] == null) this.helpContent[page] = '';
                
                const commandName = this.commandLoader.prefix + commands[i].commandName;
                const usage = commands[i].getCommandClass().usage;
                const commandDescription = commands[i].getCommandClass().description;
                
                this.helpContent[page] += '**'+ commandName + "**\n" + commandDescription + '\n Usage: ' + usage +'\n';
            }
        }
        var reqPage = 0;
        if(commandArgs[0]){
            reqPage = commandArgs[0] - 1;
            if(commandArgs[0] > this.helpContent.length){
                var embed = new discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Error')
                    .setDescription('That page is not available. Total Available Page: '+ this.helpContent.length)
                
                message.channel.stopTyping()
                message.channel.send(embed)
                return;
            }
        }
        
        var embed = new EmbedBuilder().build()
            .setTitle('-= Help (Page '+ (reqPage + 1) + ') =-')
            .setDescription(this.helpContent[reqPage])
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
            .setTimestamp()
        
        message.channel.stopTyping()
        message.channel.send(embed)
    }
}

module.exports = HelpCommand