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

    async execute(message, commandArgs){
        if(!this.commandContent.length){
            this.commandLoader.commands.sort((a,b) => {
                    if(a.options.name > b.options.name) return 1;
                    if(b.options.name > a.options.name) return -1;
                    return 0
                }).each(command => {
                    if(command.options.showInHelp){
                        this.commandContent.push({name: command.options.name, value: command.options.description, inline: false})
                    }
            })
        }
        var page = 0;
        var arg = commandArgs[0] ? commandArgs[0].toLowerCase() : null;

        if(arg){
            if(!isNaN(arg) && !isNaN(parseFloat(arg))){
                page = arg - 1;
            } else {
                var command = this.commandLoader.getCommand(arg)
                if(command == ''){
                    message.channel.send({embeds: [{color: 'RED', description: 'Command not found!'}]})
                } else {
                    message.channel.send({
                        embeds: [{
                            title: `${command.options.name} command`,
                            color: 'BLUE',
                            fields: [
                                {name: 'Command Name', value: command.options.name},
                                {name: 'Description', value: command.options.description},
                                {name: 'Usage', value: command.options.name +' '+ command.options.usage},
                                {name: 'Aliases', value: command.options.aliases.join(', ')},
                                {name: 'Guild Only', value: command.options.guildOnly ? 'Yes' : 'No'},
                            ]
                        }]
                    })
                }
                return
            }
        }

        const lastPage = Math.floor(this.commandContent.length / this.commandPerPage);
        
        if(page > lastPage || page < 0){
            message.channel.send({embeds: [{color: 'BLUE', description: 'Total Page: '+ (lastPage + 1)}]})
            return
        }

        var embed = {
            title: 'Yukino Commands',
            color: 'BLUE',
            fields: this.getPage(page),
            footer: {text: `Requested by ${message.author.username} • Page (${page + 1}/${(lastPage + 1)})`, icon_url: message.author.displayAvatarURL()}
        }

        const firstPage = await message.channel.send({embeds: [embed]})
        const emojis = ['⏪', '◀️', '▶️' ,'⏩']

        emojis.forEach(emoji => firstPage.react(emoji))

        const reactionCollector = firstPage.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot, { time: 60000 })
        reactionCollector.on('collect', reaction => {
            reaction.users.remove(message.author)

            switch(reaction.emoji.name){
                case emojis[0]:
                    page = 0;
                break;

                case emojis[1]:
                    page = (page == 0) ? 0 : page - 1;
                break;

                case emojis[2]:
                    page = (page == lastPage) ? lastPage : page + 1;
                break;

                case emojis[3]:
                    page = lastPage;
                break;
            }

            var embed2 = {
                title: 'Yukino Commands',
                color: 'BLUE',
                fields: this.getPage(page),
                footer: {text: `Requested by ${message.author.username} • Page (${page + 1}/${lastPage + 1})`, icon_url: message.author.displayAvatarURL()}
            }

            firstPage.edit({embeds: [embed2]})
        })
    }

    getPage(page){
        var fields = [];
        var start = page * this.commandPerPage;

        for(var i = start; i < (start + this.commandPerPage); i++){
            var command = this.commandContent[i];
            if(!command) continue
            fields.push(command)
        }

        return fields
    }
}

module.exports = Help