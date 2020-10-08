const Command = require('../Command.js');

class AnimeChannel extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "anime-channel",
            description: "Add channel to release animes. *(Admin only)*",
            usage: "<add|remove>",
            aliases: ['channel'],
            permissions: {administrator: true},
        });
    }
    
    execute(message, commandArgs){
        var embed = {
            color: this.client.embedRedColor
        }
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.client.dbapi.addReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        embed.color = this.client.embedGreenColor
                    }
                    embed.description = data.message
                    message.channel.createMessage({embed: embed}).then(sent => {
                        setTimeout(() => {
                            message.delete()
                            sent.delete()
                        }, 3000)
                    })
                })
            } else if (commandArgs[0] == "remove"){
                this.client.dbapi.removeReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        embed.color = this.client.embedGreenColor
                    }
                    embed.description = data.message
                    message.channel.createMessage({embed: embed}).then(sent => {
                        setTimeout(() => {
                            message.delete()
                            sent.delete()
                        }, 3000)
                    })
                })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
    
    sendUsage(message){
        message.channel.createMessage(this.options.name + ' '+ this.options.usage).then(sent => {
            message.delete({timeout: 3000})
            sent.delete({timeout: 3000})
        })
    }
}

module.exports = AnimeChannel
