const Discord = require('discord.js');
const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel.",
            usage: "<add|remove|list> <anime id>",
            aliases: ['track']
        });
    }
    
    execute(message, commandArgs){
        message.channel.startTyping()
        
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    embed.setDescription('**Usage:** '+ this.usage)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                    return;
                }
                this.client.dbapi.addTrackingAnime(message.channel, anime,(error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if (commandArgs[0] == "remove"){
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    embed.setDescription('**Usage:** '+ this.usage)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                    return;
                }
                this.client.dbapi.removeTrackingAnime(message.channel, anime, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
            } else if(commandArgs[0] == "list") {
                const channels = this.client.animeLoader.release_channels;
                channels.forEach(chh => {
                    if(chh.channel_id == message.channel.id){
                        const trackings = chh.tracking.split(',').join(', ')
                        
                        embed.setColor('RANDOM')
                        embed.setTitle('This channel is tracking:')
                        embed.setDescription(trackings)
                        
                        message.channel.send(embed)
                        message.channel.stopTyping()
                    }
                })
                return;
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
}

module.exports = TrackAnime