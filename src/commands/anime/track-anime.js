const Discord = require('discord.js');
const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel. *(Admin only)*",
            usage: "<add|remove|list|clear> <anime id>",
            aliases: ['track'],
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
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    this.sendUsage(message)
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
                    this.sendUsage(message)
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
                const channels = this.client.animeRelease.release_channels;
                var found = false;
                channels.forEach(chh => {
                    if(chh.channel_id == message.channel.id){
                        found = true;
                        const trackings = chh.tracking.split(',').join(', ')
                        
                        if(chh.tracking != ''){
                            embed.setColor('RANDOM')
                            embed.setTitle('This channel is tracking:')
                            embed.setDescription(trackings)
                        } else {
                            embed.setDescription('This channel isn\'t tracking any anime.')
                        }
                        
                        message.channel.send(embed)
                        message.channel.stopTyping()
                        return;
                    }
                })
                if(!found){
                    embed.setDescription('This channel isn\'t anime release channel.')
                    message.channel.send(embed)
                    message.channel.stopTyping();
                }
                return;
            } else if(commandArgs[0] == "clear") {
                this.client.dbapi.clearTrackingAnime(message.channel, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
                return;
            } else {
                this.sendUsage(message)
            }
        } else {
            this.sendUsage(message)
        }
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
    }
}

module.exports = TrackAnime