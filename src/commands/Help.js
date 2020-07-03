const Color = require('../utils/Color.js')
const Command = require('./Command.js');

class Help extends Command{
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
                message.channel.send({
                    embed: {
                        title: 'ERROR',
                        description: 'That page is not available. Total Available Page: '+ this.helpContent.length,
                        color: '#FF0000'
                    }
                })
                message.channel.stopTyping()
                return;
            }
        }
        
        message.channel.send({
            embed: {
                title: 'Help (Page '+ (reqPage + 1)+'/'+this.helpContent.length+')',
                description: this.helpContent[reqPage],
                color: Color.random(),
                footer: {
                    text: 'Requested by '+ message.author.username,
                    icon_url: message.author.displayAvatarURL()
                }
            }
        })
        message.channel.stopTyping()
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

module.exports = Help