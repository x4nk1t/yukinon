const Command = require('../Command.js')

class Help extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: 'help',
            description: 'Help command',
            usage: '[page|command]',
            aliases: ['?']
        })

        this.commandContent = [];
        this.commandPerPage = 8;
    }

    execute(message, commandArgs){
        if(!this.commandContent.length){
            this.commandLoader.commands.sort((a,b) => {
                    if(a.options.name > b.options.name) return 1;
                    if(b.options.name > a.options.name) return -1;
                    return 0
                }).each(command => {
                this.commandContent.push({name: command.options.name, value: command.options.description, inline: false})
            })
        }
        var page = 0;

        if(commandArgs[0]){
            if(!isNaN(commandArgs[0]) && !isNaN(parseFloat(commandArgs[0]))){
                page = commandArgs[0] - 1;
            } else {
                var command = '';
                this.commandLoader.commands.some(cmd => {
                    if(cmd.options.name.toLowerCase() == commandArgs[0].toLowerCase()){
                        command = cmd;
                        return
                    }
                })
                if(command == ''){
                    message.channel.send({embed: {color: 'RED', description: 'Command not found!'}})
                } else {
                    message.channel.send({
                        embed: {
                            title: `${command.options.name} command`,
                            color: 'BLUE',
                            fields: [
                                {name: 'Command Name', value: command.options.name},
                                {name: 'Description', value: command.options.description},
                                {name: 'Usage', value: command.options.name +' '+ command.options.usage},
                                {name: 'Aliases', value: command.options.aliases.join(', ')},
                                {name: 'Guild Only', value: command.options.guildOnly ? 'Yes' : 'No'},
                            ]
                        }
                    })
                }
                return
            }
        }

        const availPage = Math.floor(this.commandContent.length / this.commandPerPage) + 1;
        
        if((page + 1) > availPage || (page + 1) <= 0){
            message.channel.send({embed: {color: 'BLUE', description: 'Total Page: '+ availPage}})
            return
        }

        var embed = {
            title: 'Yukino Commands',
            color: 'BLUE',
            fields: [],
            footer: {text: `Requested by ${message.author.username} • Page (${page + 1}/${availPage})`, icon_url: message.author.displayAvatarURL()}
        }

        var start = page == 0 ? 0 : page * this.commandPerPage;

        for(var i = start; i < (start + this.commandPerPage); i++){
            var command = this.commandContent[i];
            if(command){
                embed.fields.push(command)
            }
        }

        message.channel.send({embed: embed})
    }
}

module.exports = Help