const Discord = require('discord.js');
const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel. *(Admin only)*",
            usage: "[add|remove|clear] <anime name>",
            aliases: ['track'],
            permissions: ['MANAGE_CHANNELS'],
            guildCommand: true
        });
    }
    
    execute(message, commandArgs){
        if(!this.hasRequiredPermissions(message)){
            return
        }
        
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
                        embed.setColor('GREEN')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
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
                        embed.setColor('GREEN')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                })
            } else if(commandArgs[0] == "clear") {
                this.client.dbapi.clearTrackingAnime(message.channel, (error, data) => {
                    if(!error){
                        embed.setColor('RANDOM')
                    }
                    embed.setDescription(data.message)
                    message.channel.send(embed)
                })
                return;
            } else {
                this.sendUsage(message)
            }
        } else {
            const channels = this.client.animeRelease.release_channels;
            var found = false;
            channels.forEach(chh => {
                if(chh.channel_id == message.channel.id){
                    found = true;
                    const trackings = '-'+ chh.tracking.split('|').join('\n -').slice(0, -1) //temp change
                    
                    if(chh.tracking != ''){
                        embed.setColor('BLUE')
                        embed.setTitle('This channel is tracking:')
                        embed.setDescription(trackings)
                    } else {
                        embed.setDescription('This channel isn\'t tracking any anime.')
                    }
                    
                    message.channel.send(embed)
                    return;
                }
            })
            if(!found){
                embed.setDescription('This channel isn\'t anime release channel.')
                message.channel.send(embed)
            }
            return;
        }
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
    }
}

module.exports = TrackAnime
