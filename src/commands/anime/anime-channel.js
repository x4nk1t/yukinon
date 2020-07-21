const Discord = require('discord.js');
const Command = require('../Command.js');

class AnimeChannel extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "anime-channel",
            description: "Add channel to release animes.",
            usage: "<add|remove>",
            aliases: ['channel']
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                this.client.dbapi.addReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        this.addToArray(message.channel)
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if (commandArgs[0] == "remove"){
                this.client.dbapi.removeReleaseChannel(message.channel, (error, data) => {
                    if(!error){
                        this.removeFromArray(message.channel)
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else {
                embed.setDescription('**Usage:** '+ this.usage)
                message.channel.send(embed)
                message.channel.stopTyping()
            }
        } else {
            embed.setDescription('**Usage:** '+ this.usage)
            message.channel.send(embed)
            message.channel.stopTyping()
        }
    }
    
    addToArray(channel){
        var channels = this.client.animeLoader.release_channels;
        channels.forEach(chh => {
            if(chh.channel_id == channel.id){
                return;
            }
        })
        channels.push({channel_id: channel.id, tracking: ''})
    }
    
    removeFromArray(channel){
        var channels = this.client.animeLoader.release_channels;
        channels.forEach((chh, i) => {
            if(chh.channel_id == channel.id){
                channels.splice(i, 1)
            }
        })
    }
}

module.exports = AnimeChannel