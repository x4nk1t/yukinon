const Command = require('../../../utils/Command.js');

class AnimeChannel extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "anime-channel",
            description: "Get releases in a channel.",
            usage: "<add|remove> [channel]",
            aliases: ['channel']
        });
    }
    
    execute(message, commandArgs){
        var channel = message.channel;
        var embed = {}
        if(commandArgs[0]){
            if(commandArgs[0] == 'add' || commandArgs[0] == 'remove'){
                if(commandArgs[1]){
                    channel = message.mentions.channels.first()
                    if(!channel) channel = message.channel
                }
                
                if(commandArgs[0] == 'remove'){
                    if(this.isAnimeChannel(channel.id)){
                        const remove = this.client.animeManager.removeAnimeChannel(channel.id);
                        if(remove){
                            this.client.animeManager.animeChannels.some((ch, index) => {
                                if(ch.channel_id == channel.id){
                                    this.client.animeManager.animeChannels.splice(index, 1)
                                    return
                                }
                            })
                            embed.color = 'GREEN';
                            embed.description = 'Successfully removed '+ channel.toString() + '.';
                        } else {
                            embed.color = 'RED';
                            embed.description = 'Something went wrong while removing '+ channel.toString()
                        }
                        
                        message.channel.send({embed: embed})
                    } else {
                        embed.color = 'RED';
                        embed.description = ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' is not an anime channel.';
                        message.channel.send({embed: embed})
                    }
                } else {
                    if(!this.isAnimeChannel(channel.id)){                    
                        const add = this.client.animeManager.addAnimeChannel(channel.id)
                        if(add){
                            this.client.animeManager.animeChannels.push({channel_id: channel.id, tracking: '', last_updated: new Date().getTime()})
                            embed.color = 'GREEN';
                            embed.description = 'Successfully added '+ channel.toString() + '.';
                        } else {
                            embed.color = 'RED';
                            embed.description = 'Something went wrong while adding '+ channel.toString()
                        }
                        
                        message.channel.send({embed: embed})
                    } else {
                        embed.color = 'RED';
                        embed.description = ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' is already an anime channel. You don\'t have to do it twice.';
                        message.channel.send({embed: embed})
                    }
                }
                return
            }
        }
        this.sendUsage(message)
    }
    
    isAnimeChannel(channel_id){
        var found = false;
        this.client.animeManager.animeChannels.forEach(channel => {
            if(channel_id == channel.channel_id){
                found = true
                return
            }
        })
        return found
    }
}

module.exports = AnimeChannel;
