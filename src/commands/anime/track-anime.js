const Command = require('../Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "track-anime",
            description: "Add anime to track in the channel. *(Admin only)*",
            usage: "[add|remove|clear] <anime name>",
            aliases: ['track'],
            permissions: {administrator: true},
        });
    }
    
    execute(message, commandArgs){
        var embed = {
            color: this.client.embedRedColor
        }
        
        if(commandArgs[0]){
            if(commandArgs[0] == "add"){
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    this.sendUsage(message, true)
                    return;
                }
                this.client.dbapi.addTrackingAnime(message.channel, anime,(error, data) => {
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
                commandArgs.shift()
                const anime = commandArgs.join(' ')
                if(anime == ''){
                    this.sendUsage(message, true)
                    return;
                }
                this.client.dbapi.removeTrackingAnime(message.channel, anime, (error, data) => {
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
            } else if(commandArgs[0] == "clear") {
                this.client.dbapi.clearTrackingAnime(message.channel, (error, data) => {
                    if(!error){
                        embed.color = this.client.embedColor
                    }
                    embed.description = data.message
                    message.channel.createMessage({embed: embed}).then(sent => {
                        setTimeout(() => {
                            message.delete()
                            sent.delete()
                        }, 3000)
                    })
                })
                return;
            } else {
                this.sendUsage(message, true)
            }
        } else {
            const channels = this.client.animeRelease.release_channels;
            var found = false;
            channels.forEach(chh => {
                if(chh.channel_id == message.channel.id){
                    found = true;
                    const trackings = '-'+ chh.tracking.split('|').join('\n -').slice(0, -1) //temp change
                    
                    if(chh.tracking != ''){
                        embed.color = this.embedColor
                        embed.title = 'This channel is tracking:'
                        embed.description = trackings
                    } else {
                        embed.description = 'This channel is not tracking any anime.'
                    }
                    
                    message.channel.createMessage({embed: embed})
                    return;
                }
            })
            if(!found){
                embed.description = 'This is not an anime release channel.'
                message.channel.createMessage({embed: embed})
            }
            return;
        }
    }
    
    filterName(string){
        return string.toLowerCase().replace(' ', '').replace('\t', '')
    }
}

module.exports = TrackAnime
