const Discord = require('discord.js');
const Command = require('../Command.js');

class AnimeChannel extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "anime-channel",
            description: "Add channel to release animes. *(Admin only)*",
            usage: "<add|remove>",
            aliases: ['channel'],
            permissions: ['MANAGE_CHANNELS'],
            guildCommand: true
        });
    }
    
    execute(message, commandArgs){
        if(!this.hasRequiredPermissions(message)){
            return
        }

        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.client.dbapi.addReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if (commandArgs[0] == "remove"){
                this.client.dbapi.removeReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
}

module.exports = AnimeChannel