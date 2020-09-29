const Discord = require('discord.js');
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
        var embed = new Discord.MessageEmbed()
        
        var reqPage = 0;
        if(commandArgs[0]){
            reqPage = commandArgs[0] - 1;
            if(commandArgs[0] > this.helpContent.length){
                embed.setTitle('ERROR')
                    .setDescription('That page is not available. Total Page: '+ this.helpContent.length)
                    .setColor('RED')
                message.channel.send(embed)
                return;
            }
        }
        embed.setTitle('Help (Page '+ (reqPage + 1)+'/'+this.helpContent.length+')')
            .setDescription(this.helpContent[reqPage])
            .setColor('BLUE')
            .setFooter('Requested by '+ message.author.username, message.author.displayAvatarURL())
            
        message.channel.send(embed)
    }
    
    loadHelpContents(){
        var commands = this.commandLoader.commands;
        var page = 0;
        var i = 0;
        
        commands.sort((a, b) => (a.name < b.name)? -1 : ((a.name > b.name) ? 1 : 0)).forEach(command => {
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
            i++;
        })
        this.client.logger.info(this.commandLoader.commands.size +" commands loaded.")
    }
}

module.exports = Help
