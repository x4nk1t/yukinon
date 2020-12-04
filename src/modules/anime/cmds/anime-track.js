const Command = require('../../../utils/Command.js');

class TrackAnime extends Command{
    constructor(commandLoader){
        super(commandLoader, {
            name: "anime-track",
            description: "Track/Untrack an anime in a channel.",
            usage: "<add|remove|clear> [channel] <anime_id>",
            aliases: ['track']
        });
    }
    
    async execute(message, commandArgs){
        var channel = message.channel
        if(commandArgs[0]){
            const action = commandArgs[0].toLowerCase()
            
            if(message.mentions.channels.first() && commandArgs[0] == message.mentions.channels.first().toString()){
                if(!this.isAnimeChannel(message.mentions.channels.first().id)){
                    message.channel.send({embed: {color: 'RED', description: message.mentions.channels.first().toString() +' is not an anime channel.'}})
                    return
                }
                
                this.sendTrackingEmbed(message.mentions.channels.first(), message)
                return
            }
            
            if(action != 'add' && action != 'remove' && action != 'clear'){
                this.sendUsage(message)
                return
            }
            
            var anime_id = ''
            if(message.mentions.channels.first() && commandArgs[1] == message.mentions.channels.first().toString()) {
                channel = message.mentions.channels.first()
                
                if(action == 'clear'){
                    const clear = await this.clearTrack(channel.id)
                    if(clear){
                        message.channel.send({embed: {color: 'GREEN', description: 'Successfully cleared '+ channel.toString() +'\'s tracking list.'}})
                    } else {
                        message.channel.send({embed: {color: 'RED', description: 'Something went wrong while clearing '+ channel.toString() +'\'s tracking list.'}})
                    }
                    return
                }
                
                if(commandArgs[2]){
                    anime_id = parseInt(commandArgs[2])
                } else {
                    this.sendUsage(message)
                    return
                }
            } else {
                anime_id = parseInt(commandArgs[1])
            }
            
            if(!this.isAnimeChannel(channel.id)){
                message.channel.send({embed: {color: 'RED', description: ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' is not an anime channel.'}})
                return
            }
            
            if(action == 'clear'){
                const clear = await this.clearTrack(channel.id)
                if(clear){
                    message.channel.send({embed: {color: 'GREEN', description: 'Successfully cleared this channel\'s tracking list.'}})
                } else {
                    message.channel.send({embed: {color: 'RED', description: 'Something went wrong while clearing this channel\'s tracking list.'}})
                }
            }
            
            if(!anime_id){
                message.channel.send({embed: {color: 'RED', description: 'Anime ID must be integer.'}})
                return
            }
            
            if(action == 'add') {
                if(this.isInTracking(channel.id, anime_id)){
                     message.channel.send({embed: {color: 'RED', description: 'Anime '+ anime_id +' is already being tracked.'}})
                     return           
                }
                const add = await this.addTrack(channel.id, anime_id)
                if(add){
                    message.channel.send({embed: {color: 'GREEN', description: 'Successfully added '+ this.linkId(anime_id) +' to the list.'}})
                } else {
                    message.channel.send({embed: {color: 'RED', description: 'Something went wrong while adding '+ this.linkId(anime_id) +' to the list.'}})
                }
            } else if(action == 'remove'){
                if(!this.isInTracking(channel.id, anime_id)){
                     message.channel.send({embed: {color: 'RED', description: 'Anime '+ anime_id +' is not being tracked.'}})
                     return           
                }
                const remove = await this.removeTrack(channel.id, anime_id)
                if(remove){
                    message.channel.send({embed: {color: 'GREEN', description: 'Successfully removed '+ this.linkId(anime_id) +' from the list.'}})
                } else {
                    message.channel.send({embed: {color: 'RED', description: 'Something went wrong while removing '+ this.linkId(anime_id) +' from the list.'}})
                }
            }
        } else {
            if(!this.isAnimeChannel(channel.id)){
                message.channel.send({embed: {color: 'RED', description: 'This is not an anime channel.'}})
                return
            }
            this.sendTrackingEmbed(channel, message)
        }
    }
    
    sendTrackingEmbed(channel, message){
        var idArray = [];
        var description = '';
        
        this.client.animeManager.animeChannels.forEach(async ch => {
            if(ch.channel_id == channel.id){
                var trackings = ch.tracking.split(',');
                
                trackings.forEach(tr => {
                    if(tr != '')
                        idArray.push(tr)
                })
                
                if(idArray.length){
                    var animeDetails = await this.client.animeManager.getAnimeFromIDArray(idArray)
                    
                    animeDetails.forEach(detail => {
                        var title = detail.title.userPreferred;
                        var originCountry = detail.countryOfOrigin;
                        var id = detail.id;
                        
                        if(originCountry == "JP"){
                            description += '- ['+ this.shortText(title) +'](https://anilist.co/anime/'+ id +')\n'
                        }
                    })                
                } else {
                    description = ((channel.id == message.channel.id) ? 'This' : channel.toString()) +' channel is not tracking any anime.'
                }
                
                message.channel.send({
                    embed: {
                        title: channel.toString() +'\'s tracking list',
                        color: 'BLUE',
                        description: description
                    }
                })
            }
        })
    }
    
    isAnimeChannel(channel_id){
        var found = false;
        this.client.animeManager.animeChannels.forEach(channel => {
            if(channel_id == channel.channel_id){
                found = true
            }
        })
        return found
    }
    
    async addTrack(channel_id, anime_id){
        var trackings = []
        var ok = false
        
        this.client.animeManager.animeChannels.forEach(async channel => {
            if(channel.channel_id == channel_id){
                if(channel.trackings == '') {
                    channel.trackings = []
                } else {
                    trackings = channel.tracking.split(',')
                }
                
                trackings.push(anime_id)
                channel.tracking = trackings.join(',')
                ok = true
            }
        })
        
        if(ok) {
            await this.client.animeManager.updateTracking(channel_id, trackings.join(','))
            return true
        } else {
            return false
        }
    }
    
    async clearTrack(channel_id){
        const clear = await this.client.animeManager.updateTracking(channel_id, '')
        if(clear){
            this.client.animeManager.animeChannels.forEach(channel => {
                if(channel.channel_id == channel_id){
                    channel.tracking = ''
                }
            })
        }
        return clear
    }
    
    async removeTrack(channel_id, anime_id){
        var ok = false
        var trackings = [];
        
        this.client.animeManager.animeChannels.forEach(async channel => {
            if(channel.channel_id == channel_id){
                trackings = channel.tracking.split(',')
                
                var index = trackings.indexOf(anime_id)
                
                trackings.splice(index, 1)
                channel.tracking = trackings.join(',')
                ok = true
            }
        })
        if(ok) {
            await this.client.animeManager.updateTracking(channel_id, trackings.join(','))
            return true
        } else {
            return false
        }
    }
    
    isInTracking(channel_id, anime_id){
        var found = false;
        
        this.client.animeManager.animeChannels.forEach(channel => {
            if(channel.channel_id == channel_id){
                var trackings = channel.tracking.split(',')
                
                trackings.forEach((tr, index) => {
                    if(tr == anime_id){
                        found = true
                    }
                })
            }
        })
        return found
    }
    
    linkId(anime_id){
        return 'Anime ['+ anime_id +'](https://anilist.co/anime/'+ anime_id + ')';
    }
    
    shortText(text, length = 30) {
        if (text == null) {
            return "";
        }
        if (text.length <= length) {
            return text;
        }
        text = text.substring(0, length);
        var last = text.lastIndexOf(" ");
        text = text.substring(0, last);
        return text + "...";
    }
}

module.exports = TrackAnime
