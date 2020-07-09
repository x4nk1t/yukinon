const Command = require('../Command.js');

class Help extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "help",
            description: "Shows the command info.",
            usage: "[page]",
            aliases: ['h', '?']
        });
        
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
                color: 'RANDOM',
                footer: {
                    text: 'Requested by '+ message.author.username,
                    icon_url: message.author.displayAvatarURL()
                }
            }
        })
        message.channel.stopTyping()
    }
    
    loadHelpContents(){
        var commands = this.commandLoader.commands;
        var page = 0;
        
        commands.array().sort((a, b) => (a.name < b.name)? -1 : ((a.name > b.name) ? 1 : 0)).forEach((command, i) => {
            if(i != 0 && i % this.helpPerPage == 0) page++;
            if(this.helpContent[page] == null) this.helpContent[page] = '';
            
            const commandName = command.commandName;
            const usage = command.usage;
            const commandDescription = command.description;
            var commandAliases = '';
            
            if(command.aliases.length){
                commandAliases = 'Aliases: '+ command.aliases.map(alias => this.prefix + alias).join(', ') + '\n';
            }
            
            this.helpContent[page] += '**'+ commandName + '**\n' + commandDescription + '\n Usage: ' + usage +'\n' + commandAliases;
        })
    }
}

module.exports = Help