const EmbedBuilder = require('../utils/EmbedBuilder.js')
const Command = require('./Command.js');

class HelpCommand extends Command{
    constructor(commandLoader){
        super(commandLoader, "help", "Shows the command info.", "[page]");
        
        this.helpContent = [];
        this.helpPerPage = 4;
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        var reqPage = 0;
        if(commandArgs[0]){
            reqPage = commandArgs[0] - 1;
            if(commandArgs[0] > this.helpContent.length){
                var embed = new EmbedBuilder().build()
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
    
    loadHelpContents(){
        var commands = this.commandLoader.loadedCommands;
        var page = 0;
        
        for(var i = 0; i < commands.length; i++){
            if(i != 0 && i % this.helpPerPage == 0) page++;
            if(this.helpContent[page] == null) this.helpContent[page] = '';
            
            const commandName = this.commandLoader.prefix + commands[i].commandName;
            const usage = commands[i].commandClass.usage;
            const commandDescription = commands[i].commandClass.description;
            
            this.helpContent[page] += '**'+ commandName + "**\n" + commandDescription + '\n Usage: ' + usage +'\n';
        }
    }
}

module.exports = HelpCommand